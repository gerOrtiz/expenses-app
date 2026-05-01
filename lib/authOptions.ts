import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { UserI } from "@/interfaces/users";
import { verifyPassword } from "@/lib/auth/password";
import { connectToDB } from "@/lib/db";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt' as const,
		maxAge: 60 * 60 * 24 * 7, // 7 days
	},
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
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
				const user = await usersCollection.findOne({ email: email }) as UserI | null;
				if (!user) {
					await client.close();
					throw new Error("No user found");
				}
				const isValid = await verifyPassword(password, user.password || '');
				if (!isValid) { client.close(); throw new Error('Email or password invalid'); }
				await client.close();
				return {
					id: user._id?.toString() || user.id || '',
					email: user.email,
					name: user.name
				};
			}
		})
	],
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === 'google') {
				try {
					const { client, db } = await connectToDB();
					const usersCollection = db.collection('users');
					const existingUser = await usersCollection.findOne({ email: user.email });
					if (!existingUser) {
						await usersCollection.insertOne({
							name: user.name,
							email: user.email,
							createdAt: new Date().getTime(),
							updatedAt: new Date().getTime()
						});
					}
					await client.close();
				} catch (error) {
					return false;
				}
			}
			return true;
		},
		async session({ session, token }) {
			if (token?.sub) {
				session.user.id = token.sub;
			}
			return session;
		}
	}
};
