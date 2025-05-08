'use client';

import logoImage from "@/assets/logo-big.png";
import calculatorImage from "@/assets/calculator.jpg";
import { Button, Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function LandingpPage() {
	const router = useRouter();

	const handleGetStartedClick = () => {
		router.replace('/user');
	};

	return (<>
		<section className="lg:w-3/5 sm:w-full flex flex-col gap-4">
			<Typography variant="h2" color="black"  >{`Take full control of your finances in one place`}</Typography>
			<Typography variant="h6" color="gray"  >
				{`Say goodbye to financial stress. Expenses app is here to help you with you money management. Whether you're budgeting, tracking expenses or saving for something. Let Expenses App be your guide to achieve it.`}
			</Typography>
			<div className="w-full flex justify-center gap-6">
				<Button variant="outlined"  >Learn more</Button>
				<Link href="/user">
					<Button variant="filled" color="blue" className="hover:bg-blue-600" onClick={handleGetStartedClick}>Get started</Button>
				</Link>

			</div>
			<div className="w-full flex justify-center">
				<Image src={logoImage} alt="Logo" width={300} priority />
			</div>
		</section>
		<section className="w-full flex flex-col mt-6">
			<div className="lg:w-3/5 sm:w-full flex flex-col gap-4 self-center">
				<Typography variant="h2" color="black"  >{`The all expenses platform`}</Typography>
				<Typography variant="h6" color="gray"  >
					{`Experience the convenience of managing your money on the go with Expenses App. Wheter is paying bills, send money or shopping, we've got you covered.`}
				</Typography>
			</div>
			<div className="w-full grid lg:grid-cols-3 sm:grid-cols-1 lg:gap-4 sm:gap-1 mt-7">
				<div className="col-span-1">
					<Card className="mt-6">
						<CardHeader color="blue-gray" className=" h-56"  >
							<Image src={calculatorImage} alt="Calculator" className="w-full" />
						</CardHeader>
						<CardBody  >
							<Typography color="blue-gray" variant="h5"  >
								{`Lorem ipsum est`}
							</Typography>
							<Typography  >
								{`Lorem ipsum dolor sit amet consectetur adipiscing elit lectus phasellus odio massa, condimentum est habitant in et iaculis vehicula ultricies dui ornare nibh`}
							</Typography>
						</CardBody>
					</Card>
				</div>
				<div className="col-span-1">
					<Card className="mt-6"  >
						<CardHeader color="blue-gray" className="relative h-56"  >
							<Image src={calculatorImage} alt="Calculator" className="w-full" />
						</CardHeader>
						<CardBody  >
							<Typography color="blue-gray" variant="h5"  >
								{`Lorem ipsum est`}
							</Typography>
							<Typography  >
								{`Lorem ipsum dolor sit amet consectetur adipiscing elit lectus phasellus odio massa, condimentum est habitant in et iaculis vehicula ultricies dui ornare nibh`}
							</Typography>
						</CardBody>
					</Card>
				</div>
				<div className="col-span-1">
					<Card className="mt-6"  >
						<CardHeader color="blue-gray" className="relative h-56"  >
							<Image src={calculatorImage} alt="Calculator" className="w-full" />
						</CardHeader>
						<CardBody  >
							<Typography color="blue-gray" variant="h5"  >
								{`Lorem ipsum est`}
							</Typography>
							<Typography  >
								{`Lorem ipsum dolor sit amet consectetur adipiscing elit lectus phasellus odio massa, condimentum est habitant in et iaculis vehicula ultricies dui ornare nibh`}
							</Typography>
						</CardBody>
					</Card>
				</div>
			</div>
		</section>

		<section className="lg:py-16">
			<div className="container mx-auto text-center">
				<Typography variant="h2" className="mb-12" >How It Works</Typography>

				<div className="flex flex-wrap justify-center gap-8">
					<div className="step-card bg-white rounded-lg shadow-md p-8 w-64">
						<div className="icon-container mb-6">
							<div className="rounded-full bg-blue-100 p-4 inline-flex">
								<svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
								</svg>
							</div>
						</div>
						<Typography variant="h5" className="font-semibold mb-2">1. Create an Account</Typography>
						<p className="text-gray-600">Sign up in seconds and set up your personal finance dashboard</p>
					</div>

					<div className="step-card bg-white rounded-lg shadow-md p-8 w-64">
						<div className="icon-container mb-6">
							<div className="rounded-full bg-blue-100 p-4 inline-flex">
								<svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
								</svg>
							</div>
						</div>
						<Typography variant="h5" className="font-semibold mb-2" >2. Track Expenses</Typography>
						<p className="text-gray-600">Add your daily expenses and categorize them with just a few clicks</p>
					</div>

					<div className="step-card bg-white rounded-lg shadow-md p-8 w-64">
						<div className="icon-container mb-6">
							<div className="rounded-full bg-blue-100 p-4 inline-flex">
								<svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
								</svg>
							</div>
						</div>
						<Typography variant="h5" className="font-semibold mb-2" >3. Gain Financial Clarity</Typography>
						<p className="text-gray-600">View detailed reports and visualize your spending habits</p>
					</div>
				</div>

				<div className="mt-12">
					<Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300" onClick={handleGetStartedClick} >
						Get Started Now
					</Button>
				</div>
			</div>
		</section>
	</>);
}

export default LandingpPage;
