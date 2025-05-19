import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserI } from "@/interfaces/users";
import { verifyPassword } from "@/lib/auth/password";
import { connectToDB } from "@/lib/db";

export const authOptions: NextAuthOptions = {
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
					await client.close();
					// await disconnectFromDB();
					throw new Error("No user found");
				}
				const isValid = await verifyPassword(password, user.password || '');
				if (!isValid) { client.close(); throw new Error('Email or password invalid'); }
				await client.close();
				// await disconnectFromDB();
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
