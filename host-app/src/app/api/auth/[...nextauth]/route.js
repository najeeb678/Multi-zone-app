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
        console.log("🔐 Authorize called with:", {
          username: credentials?.username,
          hasPassword: !!credentials?.password,
        });

        try {
          const loginData = new URLSearchParams({
            username: credentials?.username,
            password: credentials?.password,
            grant_type: "password",
          });

          const backendUrl = `${process.env.APP_BASE_URL}/oauth/token`;
          console.log(`🔄 Calling backend: ${backendUrl}`);

          const dbUser = process.env.DB_USER || "abc:12345";
          const credentials_auth = "Basic " + Buffer.from(dbUser).toString("base64");

          console.log("🔑 Using DB_USER:", process.env.DB_USER);
          console.log("🔑 Auth header:", credentials_auth);

          const res = await axios.post(backendUrl, loginData.toString(), {
            headers: {
              Authorization: credentials_auth,
              "Content-Type": "application/x-www-form-urlencoded",
              "x-host": process.env.DEV_HOST || "basit.techship.me",
            },
          });

          console.log("🎯 Backend response data:", res.data);
          console.log("🍪 Backend response cookies:", res.headers["set-cookie"]);

          const userData = res.data;

          const userInfo = {
            id: userData.id,
            name: userData.name,
            username: credentials.username,
            role: userData.type,
            tenant: "production",
            permissions: userData.permissions,
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken,
            accessTokenExpires: new Date(userData.expiresAt).getTime(),
          };

          console.log("✅ User authorized:", userInfo.username);

          return userInfo;
        } catch (err) {
          console.error("❌ Authorization error:", err.message);
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
          name: user.name,
          role: user.role,
          tenant: user.tenant,
          permissions: user.permissions,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
        };
      }

      // Return previous token if not expired
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Token expired → refresh it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Check if refresh failed
      if (token.error === "RefreshAccessTokenError") {
        return null; // forces user to login again
      }
      session.user = {
        id: token.id,
        name: token.name || "",
        role: token.role || "user",
        tenant: token.tenant || "",
        permissions: token.permissions || [],
        email: token.email || null,
        image: token.image || null,
      };

      console.log("session after:", session);
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
      accessToken: data.accessToken,
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
