import { verifyPassword } from "@/lib/auth/password";
import { connectToDB } from "@/lib/db";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectToDB();
        const usersCollection = client.db().collection('users');
        const user = await usersCollection.findOne({ email: credentials.email });
        if (!user) { client.close(); throw new Error('No user found.'); }// Needs fallback
        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) { client.close(); throw new Error('Invalid password'); }
        client.close();
        return { email: user.email, username: user.email, name: user.name, id: user._id.toString() };
      }
    })
  ]
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };