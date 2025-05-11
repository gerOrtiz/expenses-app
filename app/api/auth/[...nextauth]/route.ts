import { UserI } from "@/interfaces/users";
import { verifyPassword } from "@/lib/auth/password";
import { connectToDB } from "@/lib/db";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
	session: {
		strategy: 'jwt' as const
	},
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password required");
				}
				const { email, password } = credentials as { email: string, password: string };
				const { db, client } = await connectToDB();
				const usersCollection = db.collection('users');
				const user = await usersCollection.findOne({ email: credentials.email }) as UserI | null;
				if (!user) {
					client.close();
					throw new Error("No user found");
				}
				const isValid = await verifyPassword(password, user.password || '');
				if (!isValid) { client.close(); throw new Error('Email or password invalid'); }
				client.close();
				return {
					id: user._id?.toString() || user.id || '',
					email: user.email,
					name: user.name
				};
			}
		})
	], callbacks: {
		async session({ session, token }) {
			if (token?.sub) {
				session.user.id = token.sub;
			}
			return session;
		}
	}
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
