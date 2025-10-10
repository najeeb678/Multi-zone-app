import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Custom Login",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@domain.com" },
        password: { label: "Password", type: "password" },
      },
      // async authorize(credentials) {
      //   const res = await fetch(`${process.env.APP_BASE_URL}/auth/login`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       email: credentials.email,
      //       password: credentials.password,
      //     }),
      //   });

      //   const data = await res.json();

      //   if (!res.ok) throw new Error(data.message || "Invalid credentials");

      //   return {
      //     id: data.user.id,
      //     name: data.user.name,
      //     email: data.user.email,
      //     role: data.user.role,
      //     tenant: data.user.tenant,
      //     config: data.config || {},
      //   };
      // },
      async authorize(credentials) {
        console.log("Authorize called", credentials);

        // MOCK login for testing
        if (credentials.email === "test@example.com" && credentials.password === "12345") {
          return {
            id: "user_001",
            name: "Test User",
            email: "test@example.com",
            role: "admin",
            tenant: "demo",
            config: { theme: "dark" },
          };
        }

        return null; // invalid login
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
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenant = user.tenant;
        token.config = user.config;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.tenant = token.tenant;
      session.user.config = token.config;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
