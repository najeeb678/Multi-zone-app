import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Custom Login",
      credentials: {
        username: { label: "username", type: "text", placeholder: "user@domain.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // console.log("🔐 Authorize called with:", {
        //   username: credentials?.username,
        //   hasPassword: !!credentials?.password,
        // });

        try {
          const loginData = new URLSearchParams({
            username: credentials?.username,
            password: credentials?.password,
            grant_type: "password",
          });

          const backendUrl = `${process.env.APP_BASE_URL}/oauth/token`;
          console.log(`🔄 Calling backend: ${backendUrl}`);

          // Create proper authorization header exactly like the working code
          const dbUser = process.env.DB_USER || "abc:12345";
          const credentials_auth = "Basic " + Buffer.from(dbUser).toString("base64");

          // console.log("🔑 Using DB_USER:", process.env.DB_USER);
          // console.log("🔑 Auth header:", credentials_auth);

          const res = await axios.post(backendUrl, loginData.toString(), {
            headers: {
              Authorization: credentials_auth,
              "Content-Type": "application/x-www-form-urlencoded",
              "x-host": process.env.DEV_HOST || "basit.techship.me",
            },
          });

          console.log("🎯 Backend response data:", res.data);
          // console.log("🍪 Backend response cookies:", res.headers["set-cookie"]);

          // The working code returns a response like: { STATUS: "SUCCESS", USER: {...} }
          // But your earlier test showed a direct response, so handle both cases
          let responseData = res.data;
          let userData = responseData;
          // 🧩 Handle both wrapped and direct formats
          if (responseData.STATUS === "SUCCESS" && responseData.USER) {
            userData = responseData.USER;
            console.log("📦 Found wrapped response with USER object");
          } else if (responseData.STATUS === "FAILED") {
            console.error("❌ Authentication failed:", responseData.MESSAGE || "Invalid credentials");
            return null;
          } else {
            console.log("📦 Direct response format");
          }

          // 🧠 Extract token from data (no cookies needed)
          const backendToken =
            userData.accessToken ||
            userData.token ||
            userData.access_token ||
            userData.authToken ||
            userData.jwt ||
            userData.bearerToken;

          if (!backendToken) {
            console.error("❌ No backend token found in response");
            return null;
          }
          // Construct user data from backend response
          const userInfo = {
            id: userData.userId || userData.id || "user_" + Date.now(),
            name: userData.name || credentials?.username,
            username: credentials?.username,
            role: userData.type || "user",
            tenant: "production",
            permissions: userData.permission || userData.permissions,
            warehouses: userData.warehouses,
            userName: userData.userName,
            backendToken: backendToken, // backend-issued session cookie or JWT
          };

          console.log("✅ Backend authentication successful for:", userData.username);
          return userInfo;
        } catch (err) {
          console.error("❌ Backend authentication error:", err.message);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    async jwt({ token, user }) {
      // First login
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          tenant: user.tenant,
          backendToken: user.backendToken,
          refreshToken: user.refreshToken, // save refresh token
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // e.g., 1 hour expiry, adjust if backend gives expiry
        };
      }

      // Check if token has expired
      if (Date.now() < token.accessTokenExpires) {
        // Token still valid
        return token;
      }

      // Token expired — refresh it
      console.log("🔄 Access token expired, refreshing...");
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.tenant = token.tenant;
      session.user.backendToken = token.backendToken; // pass backend token to client
      session.user.accessTokenExpires = token.accessTokenExpires;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

async function refreshAccessToken(token) {
  try {
    const res = await axios.post(
      `${process.env.APP_BASE_URL}/oauth/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }).toString(),
      {
        headers: {
          Authorization: "Basic " + Buffer.from(process.env.DB_USER).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = res.data;

    console.log("🔄 Refreshed access token:", data.accessToken);

    return {
      ...token,
      backendToken: data.accessToken,
      refreshToken: data.refreshToken || token.refreshToken,
      accessTokenExpires: new Date(data.expiresAt).getTime(),
    };
  } catch (error) {
    console.error("❌ Error refreshing access token:", error.message);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
