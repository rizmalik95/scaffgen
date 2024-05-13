import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret ) {
  throw new Error("Missing environment variables for Google authentication");
}
if (!nextAuthSecret) {
  throw new Error("Missing environment variables for NextAuth Secret");
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          scope:
            "openid https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive.file",
        },
      },
    }),
  ],
  // Configure one or more authentication providers
  secret: nextAuthSecret,
  callbacks: {
    async jwt({ token, account }) {
      // Include accessToken in the token if it's available
      if (account?.access_token) {
        token.accessToken = account.access_token as string;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass accessToken to the session
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
