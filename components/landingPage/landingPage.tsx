'use client';
import calculatorImg from "@/assets/calculator.jpg";
import moneyImg from "@/assets/money.jpg";
import reports from "@/assets/reports.jpg";
import tax from "@/assets/tax.jpg";
import savings from "@/assets/savings.jpg";
import { Button, Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./landingPage.module.css";


const descriptions = [
	{
		title: `Smart Expense Management`,
		description: `Easily record and categorize all your daily expenses. Track cash and card payments, manage pending expenses, and see where your money goes in real-time`
	}, {
		title: `Complete Financial Picture`,
		description: `Monitor your account balances, track income additions, and withdrawals. Get a clear view of your financial health with automated balance calculations.`
	}, {
		title: `Insights & Analytics`,
		description: `Generate detailed reports and visualizations of your spending patterns. Identify trends, set budgets, and make data-driven financial decisions.`
	}
];

function LandingpPage() {
	const router = useRouter();

	const handleGetStartedClick = () => {
		router.replace('/login');
	};

	return (<>

		<section id="hero" className={`${classes.hero} relative flex flex-col justify-center w-full h-screen overflow-hidden`}>
			<h1 className="sr-only">Expenses App</h1>
			<Image src={savings} alt="Calculating finances" fill className="hidden lg:flex w-full object-cover -z-10" priority />
			<Image src={tax} alt="Calculating finances" fill className="lg:hidden flex w-full object-cover -z-10" priority />

			<div
				className={`${classes.callToAction} p-4 lg:p-8 m-0 lg:mr-8 bg-transparent lg:bg-white/[0.3] w-11/12 lg:w-1/2 self-center lg:self-end gap-4`}>
				<Typography variant="h2" color="black"  >{`Take full control of your finances in one place`}</Typography>
				<Typography variant="lead" color="gray" className={`${classes.description} text-center`}  >
					{`Say goodbye to financial stress. Expenses app is here to help you with you money management. Whether you're budgeting, tracking expenses or saving for something. Let Expenses App be your guide to achieve it.`}
				</Typography>
				<div className="w-full flex justify-center gap-6">
					<Link href="#about">
						<Button variant="outlined" className="outlined" >{`Learn more`}</Button>
					</Link>
					<Button variant="filled" className="filled" onClick={handleGetStartedClick}>{`Get started`}</Button>
				</div>
			</div>

		</section>


		<section id="about" className="max-w-full flex flex-col mt-8 p-6 m-6">
			<div className="lg:w-3/5 sm:w-full flex flex-col gap-4 self-center">
				<Typography variant="h2" color="black"  >{`Take Control of Your Personal Finances`}</Typography>
				<Typography variant="paragraph" color="gray" className=" text-lg" >
					{`Track expenses, manage your money, and make informed financial decisions with our comprehensive expense tracking platform.`}
				</Typography>
			</div>
			<div className="w-full grid lg:grid-cols-3 sm:grid-cols-1 lg:gap-4 sm:gap-1 mt-7">
				{descriptions.map((item, index) => (
					<div key={item.title} className="col-span-1 h-auto">
						<Card className="mt-6 h-full flex flex-col gap-5 shadow-lg">
							<CardHeader color="blue-gray" className=" h-56"  >
								<Image src={index === 0 ? calculatorImg : index === 1 ? moneyImg : reports} alt={index === 0 ? 'calculator' : index === 1 ? 'money' : 'reports'} className="w-full" />
							</CardHeader>
							<CardBody className="flex flex-col gap-4 justify-center" >
								<Typography color="black" variant="h5"  >
									{item.title}
								</Typography>
								<Typography  >
									{item.description}
								</Typography>
							</CardBody>
						</Card>
					</div>
				))}
				{/* <div className="col-span-1 h-auto">
					<Card className="mt-6 h-auto">
						<CardHeader color="blue-gray" className=" h-56"  >
							<Image src={calculatorImg} alt="Calculator" className="w-full" />
						</CardHeader>
						<CardBody  >
							<Typography color="blue-gray" variant="h5"  >
								{`Smart Expense Management`}
							</Typography>
							<Typography  >
								{`Easily record and categorize all your daily expenses. Track cash and card payments, manage pending expenses, and see where your money goes in real-time`}
							</Typography>
						</CardBody>
					</Card>
				</div>
				<div className="col-span-1 ">
					<Card className="mt-6 "  >
						<CardHeader color="blue-gray" className="relative h-56"  >
							<Image src={moneyImg} alt="money" className="w-full" />
						</CardHeader>
						<CardBody  >
							<Typography color="blue-gray" variant="h5"  >
								{`Complete Financial Picture`}
							</Typography>
							<Typography  >
								{`Monitor your account balances, track income additions, and withdrawals. Get a clear view of your financial health with automated balance calculations.`}
							</Typography>
						</CardBody>
					</Card>
				</div>
				<div className="col-span-1">
					<Card className="mt-6"  >
						<CardHeader color="blue-gray" className="relative h-56"  >
							<Image src={reports} alt="reports" className="w-full" />
						</CardHeader>
						<CardBody  >
							<Typography color="blue-gray" variant="h5"  >
								{`Insights & Analytics`}
							</Typography>
							<Typography  >
								{`Generate detailed reports and visualizations of your spending patterns. Identify trends, set budgets, and make data-driven financial decisions.`}
							</Typography>
						</CardBody>
					</Card>
				</div> */}
			</div>
		</section>

		<section id="how it works" className="lg:py-16">
			<div className="container mx-auto text-center">
				<Typography variant="h2" className="mb-12" >How It Works</Typography>

				<div className="flex flex-wrap justify-center gap-8">
					<div className="step-card bg-white rounded-lg shadow-md p-8 w-64">
						<div className="icon-container mb-6">
							<div className="rounded-full bg-blue-100 p-4 inline-flex">
								<svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
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
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
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
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
								</svg>
							</div>
						</div>
						<Typography variant="h5" className="font-semibold mb-2" >3. Gain Financial Clarity</Typography>
						<p className="text-gray-600">View detailed reports and visualize your spending habits</p>
					</div>
				</div>

				<div className="mt-12">
					<Button className="filled py-3 px-8 rounded-lg" onClick={handleGetStartedClick} >
						Get Started Now
					</Button>
				</div>
			</div>
		</section>
	</>);
}

export default LandingpPage;
