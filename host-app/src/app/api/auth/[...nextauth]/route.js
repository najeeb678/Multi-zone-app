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
          });

          const backendUrl = `${process.env.BACKEND_URL}/v2/api/oauth/token`;
          console.log(`🔄 Calling backend: ${backendUrl}`);

          const res = await axios.post(backendUrl, loginData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "x-host": process.env.DEV_HOST || "basit.techship.me",
              "x-device-id": "nextauth-web-client",
            },
          });

          console.log("🎯 Backend response:", res.data);

          // Backend should return success status or token
          if (!res.data || res.data.STATUS === "FAILED") {
            console.error("❌ Authentication failed:", res.data?.MESSAGE || "Invalid credentials");
            return null;
          }

          // Construct user data from backend response
          const userData = {
            id: res.data.userId || "user_" + Date.now(),
            name: res.data.name || credentials?.username,
            username: credentials?.username,
            role: res.data.type || "user",
            tenant: "production",
            permissions: res.data.permission,
            warehouses: res.data.warehouses,
            userName: res.data.userName,
            backendToken: res.data.accessToken || res.data.token, // backend-issued JWT
          };

          console.log("✅ Backend authentication successful for:", userData.username);
          return userData;
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
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenant = user.tenant;
        token.config = user.config;
        token.backendToken = user.backendToken; // store backend token securely
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.tenant = token.tenant;
      session.user.config = token.config;
      // Don't expose backendToken to the client
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
