import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Custom Login",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@domain.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Authorize called with:", {
          email: credentials?.email,
          hasPassword: !!credentials?.password,
        });

        try {
          // For development mode, keep the mock login
          if (
            process.env.NODE_ENV !== "production" &&
            credentials?.email === "test@example.com" &&
            credentials?.password === "12345"
          ) {
            console.log("✅ Using mock login in development mode");
            const user = {
              id: "user_001",
              name: "Test User",
              email: "test@example.com",
              role: "admin",
              tenant: "demo",
              backendToken: "mock_jwt_token_for_development",
              config: { theme: "dark" },
            };
            console.log("🎯 Returning user object:", user);
            return user;
          }

          // Call your backend API for real login
          const res = await axios.post(`${process.env.BACKEND_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = res.data?.user;
          const token = res.data?.token;

          if (!user || !token) {
            console.error("Backend authentication failed - missing user or token");
            return null;
          }

          console.log("✅ Backend authentication successful for", user.email);

          // Return user with the backend token attached
          return {
            ...user,
            backendToken: token, // Store securely in JWT
          };
        } catch (err) {
          console.error("❌ Backend authentication error:", err.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔄 JWT Callback - token:", !!token, "user:", !!user);
      if (user) {
        console.log("🔄 JWT Callback - storing user data in token");
        // Store user data and backend token in JWT
        token.id = user.id;
        token.role = user.role;
        token.tenant = user.tenant;
        token.config = user.config;
        token.backendToken = user.backendToken; // Securely store backend JWT
        console.log("🔄 JWT Callback - token updated with user data");
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🔄 Session Callback - creating session for:", token?.id);
      // Add user data to session (accessible on client)
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.tenant = token.tenant;
      session.user.config = token.config;

      // Deliberately NOT exposing backendToken to client
      // backendToken stays in the JWT (server-side only)
      console.log("🔄 Session Callback - session created:", session.user.email);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
