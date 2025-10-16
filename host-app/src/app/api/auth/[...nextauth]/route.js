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

          // Extract refresh token if available
          const refreshToken = userData.refreshToken || userData.refresh_token || userData.refresh;

          if (!backendToken) {
            console.error("❌ No backend token found in response");
            return null;
          }

          // Parse token expiry if provided by the backend
          let tokenExpiry = null;
          if (userData.expiresAt) {
            tokenExpiry = new Date(userData.expiresAt).getTime();
          } else if (userData.expiresIn || userData.expires_in) {
            const expiresInSeconds = userData.expiresIn || userData.expires_in;
            tokenExpiry = Date.now() + expiresInSeconds * 1000;
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
            backendToken: backendToken, // backend-issued session token or JWT
            refreshToken: refreshToken, // refresh token for token renewal
            accessTokenExpires: tokenExpiry,
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
    // maxAge: 7 * 24 * 60 * 60,
    maxAge: 365 * 24 * 60 * 60, //NextAuth won’t force expire it before the backend says so.
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          tenant: user.tenant,
          backendToken: user.backendToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
        };
      }

      // Prevent loops
      if (token.error === "RefreshAccessTokenError") return token;

      const isExpired = Date.now() >= token.accessTokenExpires;
      // console.log("⏳ [JWT Callback] Token expired: ${isExpired}", isExpired);
      if (!isExpired) return token;

      try {
        return await refreshAccessToken(token);
      } catch (err) {
        console.error(" refreshAccessToken failed:", err);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.tenant = token.tenant;
      // session.user.backendToken = token.backendToken; // pass backend token to client
      session.user.accessTokenExpires = token.accessTokenExpires;

      // Pass error to client if refresh token failed
      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

async function refreshAccessToken(token) {
  console.log("🔁 refreshAccessToken called with token:", token);

  // Check if refresh token exists
  if (!token.refreshToken) {
    console.error("❌ No refresh token available");
    return {
      ...token,
      error: "NoRefreshTokenError",
    };
  }

  try {
    // Create proper authorization header
    const dbUser = process.env.DB_USER || "abc:12345";
    const credentials_auth = "Basic " + Buffer.from(dbUser).toString("base64");

    const res = await axios.post(
      `${process.env.APP_BASE_URL}/oauth/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }).toString(),
      {
        headers: {
          Authorization: credentials_auth,
          "Content-Type": "application/x-www-form-urlencoded",
          "x-host": process.env.DEV_HOST || "basit.techship.me",
        },
      }
    );

    const data = res.data;
    console.log("✅ Refresh API response received", data);

    // Extract tokens from the response, using standard OAuth field names or your custom ones
    const newAccessToken = data.accessToken || data.access_token || data.token;
    const newRefreshToken = data.refreshToken || data.refresh_token || token.refreshToken;

    if (!newAccessToken) {
      throw new Error("No access token returned from refresh token endpoint");
    }

    console.log("🔄 Successfully refreshed access token", newAccessToken);

    // Get expiry time from backend response or calculate a default
    let newExpiry;
    if (data.expiresAt) {
      newExpiry = new Date(data.expiresAt).getTime();
      console.log(
        `🕒 Using backend-provided refresh token expiry: ${new Date(newExpiry).toISOString()}`
      );
    } else if (data.expiresIn || data.expires_in) {
      const expiresInSeconds = data.expiresIn || data.expires_in;
      newExpiry = Date.now() + expiresInSeconds * 1000;
      console.log(`🕒 Using backend-provided expiresIn value: ${expiresInSeconds}s`);
    } else {
      // Default fallback (12 hours) if backend doesn't provide expiry
      newExpiry = Date.now() + 12 * 60 * 60 * 1000;
      console.log(`🕒 Using default token expiry: ${new Date(newExpiry).toISOString()}`);
    }

    return {
      ...token,
      backendToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires: newExpiry,
      error: undefined, // Clear any previous errors
    };
  } catch (error) {
    console.error("❌ Error refreshing access token:", error?.response?.data || error.message);

    // Check if the error is due to token being invalid/expired
    const isAuthError =
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      error.message.includes("invalid") ||
      error.message.includes("expired");

    return {
      ...token,
      error: isAuthError ? "RefreshAccessTokenError" : "RefreshServerError",
      // Keep the existing token, but mark as expired to force re-login on next attempt
      accessTokenExpires: 0,
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
