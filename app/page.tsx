// import Image from "next/image";
// import logoImage from "@/assets/logo-big.png"
// import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
// import Link from "next/link";

import LandingpPage from "@/components/landingPage/landingPage";

export default function Home() {
	return (
		<>
			<main className="flex justify-self-center justify-center mb-8 lg:mb-3">
				<div className=" w-full text-center flex flex-col p-0  items-center overflow-auto">
					<LandingpPage />

				</div>
			</main>
		</>

	);
}
