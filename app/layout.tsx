import Providers from "@/components/providers/providers";
import MainHeader from "@/components/ui/main-header";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/animations.css";
import React from "react";
import { AccesibillityTester } from "@/components/accesibility/accesibilityTester";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Expenses app",
	description: "Manage your personal finances",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html className="min-h-screen" lang="en">
			<script async src="https://unpkg.com/@material-tailwind/html@latest/scripts/ripple.js"></script>
			<body className={inter.className}>
				<Providers>
					<MainHeader />
					{children}
					{process.env.NODE_ENV !== 'production' && (<AccesibillityTester />)}
				</Providers>
			</body>
		</html>
	);
}
