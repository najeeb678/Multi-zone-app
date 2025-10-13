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

          // Create proper authorization header exactly like the working code
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

          // The working code returns a response like: { STATUS: "SUCCESS", USER: {...} }
          // But your earlier test showed a direct response, so handle both cases
          let responseData = res.data;
          let userData = responseData;

          // Check if it's wrapped in a response object
          if (responseData.STATUS === "SUCCESS" && responseData.USER) {
            userData = responseData.USER;
            console.log("📦 Found wrapped response with USER object");
          } else if (responseData.STATUS === "FAILED") {
            console.error("❌ Authentication failed:", responseData.MESSAGE || "Invalid credentials");
            return null;
          } else {
            console.log("📦 Direct response format");
          }

          // Extract session cookie from backend response
          const setCookieHeader = res.headers["set-cookie"];
          let backendToken = null;

          if (setCookieHeader) {
            // Look for connect.sid cookie which seems to be the session token
            const sessionCookie = setCookieHeader.find((cookie) => cookie.startsWith("connect.sid="));
            if (sessionCookie) {
              // Extract just the cookie value part
              backendToken = sessionCookie.split(";")[0]; // Gets "connect.sid=value"
              console.log("🎫 Found session cookie as token:", !!backendToken);
            }
          }

          // Fallback: check for any token in response data or USER object
          if (!backendToken) {
            backendToken =
              userData.accessToken ||
              userData.token ||
              userData.access_token ||
              userData.authToken ||
              userData.jwt ||
              userData.bearerToken;
            console.log("🎫 Found token in data:", !!backendToken);
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
      // console.log("token before:", token);
      if (user) {
        // console.log("user from authorize:", user);
        token.id = user.id;
        token.role = user.role;
        token.tenant = user.tenant;
        token.config = user.config;
        token.backendToken = user.backendToken; // store backend token securely
      }
      // console.log("token after:", token);
      return token;
    },

    async session({ session, token }) {
      // console.log("session before:", session);
      // console.log("token:", token);
      session.user.id = token.id;
      session.user.name = token.name || "";
      session.user.role = token.role || "user";
      session.user.tenant = token.tenant || "";
      session.user.config = token.config || {};
      session.user.email = token.email || null;
      session.user.image = token.image || null;
      console.log("session after:", session);
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
  
  
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import axios from "axios";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Custom Login",
//       credentials: {
//         username: { label: "username", type: "text", placeholder: "user@domain.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         console.log("🔐 Authorize called with:", {
//           username: credentials?.username,
//           hasPassword: !!credentials?.password,
//         });

//         try {
//           const loginData = new URLSearchParams({
//             username: credentials?.username,
//             password: credentials?.password,
//             grant_type: "password",
//           });

//           const backendUrl = `${process.env.APP_BASE_URL}/oauth/token`;
//           console.log(`🔄 Calling backend: ${backendUrl}`);

//           const dbUser = process.env.DB_USER || "abc:12345";
//           const credentials_auth = "Basic " + Buffer.from(dbUser).toString("base64");

//           console.log("🔑 Using DB_USER:", process.env.DB_USER);
//           console.log("🔑 Auth header:", credentials_auth);

//           const res = await axios.post(backendUrl, loginData.toString(), {
//             headers: {
//               Authorization: credentials_auth,
//               "Content-Type": "application/x-www-form-urlencoded",
//               "x-host": process.env.DEV_HOST || "basit.techship.me",
//             },
//           });

//           console.log("🎯 Backend response data:", res.data);
//           console.log("🍪 Backend response cookies:", res.headers["set-cookie"]);

//           const userData = res.data;

//           const userInfo = {
//             id: userData.id,
//             name: userData.name,
//             username: credentials.username,
//             role: userData.type,
//             tenant: "production",
//             permissions: userData.permissions,
//             accessToken: userData.accessToken,
//             refreshToken: userData.refreshToken,
//             accessTokenExpires: new Date(userData.expiresAt).getTime(),
//           };

//           console.log("✅ User authorized:", userInfo.username);

//           return userInfo;
//         } catch (err) {
//           console.error("❌ Authorization error:", err.message);
//           return null;
//         }
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//     maxAge: 24 * 60 * 60, // 1 day
//   },

//   jwt: {
//     secret: process.env.NEXTAUTH_SECRET,
//   },

//   callbacks: {
//     async jwt({ token, user }) {
//       // First login
//       if (user) {
//         return {
//           ...token,
//           id: user.id,
//           name: user.name,
//           role: user.role,
//           tenant: user.tenant,
//           permissions: user.permissions,
//           accessToken: user.accessToken,
//           refreshToken: user.refreshToken,
//           accessTokenExpires: user.accessTokenExpires,
//         };
//       }

//       // Return previous token if not expired
//       if (Date.now() < token.accessTokenExpires) {
//         return token;
//       }

//       // Token expired → refresh it
//       return await refreshAccessToken(token);
//     },
//     async session({ session, token }) {
//       // Check if refresh failed
//       if (token.error === "RefreshAccessTokenError") {
//         return null; // forces user to login again
//       }
//       session.user = {
//         id: token.id,
//         name: token.name || "",
//         role: token.role || "user",
//         tenant: token.tenant || "",
//         permissions: token.permissions || [],
//         email: token.email || null,
//         image: token.image || null,
//       };

//       console.log("session after:", session);
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// };

// async function refreshAccessToken(token) {
//   try {
//     const res = await axios.post(
//       `${process.env.APP_BASE_URL}/oauth/token`,
//       new URLSearchParams({
//         grant_type: "refresh_token",
//         refresh_token: token.refreshToken,
//       }).toString(),
//       {
//         headers: {
//           Authorization: "Basic " + Buffer.from(process.env.DB_USER).toString("base64"),
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     const data = res.data;

//     console.log("🔄 Refreshed access token:", data.accessToken);

//     return {
//       ...token,
//       accessToken: data.accessToken,
//       refreshToken: data.refreshToken || token.refreshToken,
//       accessTokenExpires: new Date(data.expiresAt).getTime(),
//     };
//   } catch (error) {
//     console.error("❌ Error refreshing access token:", error.message);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
