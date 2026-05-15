'use client';
import expensesTable from "@/screenshots/expenses-desktop1.png";
import expensesTableMobile from "@/screenshots/expenses-mobile-fit.png";
import dashboard from "@/screenshots/dashboard.png";
import reportsModule from "@/screenshots/reports.png";
import { Button } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./landingPage.module.css";
import { Text } from "../ui/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faLock, faReceipt, faWallet } from "@fortawesome/free-solid-svg-icons";


const stepCards = [
	{
		title: `1. Create your budget`,
		description: `Set your income, define your pending expenses, and you're ready to go.`,
		icon: faWallet
	}, {
		title: `2. Log your expenses`,
		description: `Add each expense as it happens: cash or card. The app keeps the running total for you.`,
		icon: faReceipt
	}, {
		title: `3. Stay in control`,
		description: `Close a period and see exactly where your money went. Then do better next month.`,
		icon: faChartPie
	}
];

const browserBarColors = ['bg-red-500', 'bg-yellow-300', 'bg-green-400'];

function LandingpPage() {
	const router = useRouter();

	const handleGetStartedClick = () => {
		router.replace('/login');
	};

	return (<>

		<section id="hero" className={`${classes.hero} relative flex flex-col justify-center w-full h-max lg:h-screen overflow-hidden`}>
			<h1 className="sr-only">Expenses App</h1>
			<div className="flex flex-col lg:flex-row w-full min-h-screen heroSection">
				<div className="flex flex-col items-center justify-center w-full lg:w-1/2 lg:h-full mt-20 p-3 lg:mt-0 lg:p-0">
					<div className="w-full lg:w-11/12 flex flex-col gap-7 text-left p-6 lg:p-4">
						<Text variant="h2" className="drop-shadow-lg">{`Know exactly what you have left, before you spend it`}</Text>
						<Text variant="body" className="lg:text-lg">{`Set your budget, track your expenses, and let the app do the math. No spreadsheets, no surprises at the end of the month.`}</Text>
						<div className="w-full flex justify-center gap-6 mt-3">
							<Link href="#features">
								<Button variant="outlined" className="outlined transition ease-in-out hover:-translate-y-1 duration-200" >
									{`How it works`}
								</Button>
							</Link>
							<Button variant="filled" className="filled transition ease-in-out hover:scale-105 duration-200"
								onClick={handleGetStartedClick}>
								{`Get started`}
							</Button>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center w-full h-full lg:w-1/2 pb-3" >
					<div className={`${classes.frameContainer} hidden lg:block`}>
						<div className={`${classes.browserBar} grid grid-cols-3`}>
							<div className="flex col-span-1 w-full">
								<div className="w-2/3 p-3 flex items-center gap-2">
									{[1, 2, 3].map((item, index) => (
										<span key={item} className={`${browserBarColors[index]} rounded-full w-3 h-3`} />
									))}
								</div>
							</div>
							<div className="col-span-1 w-full py-1 content-center">
								<div className={`flex w-full  rounded-md py-1 ${classes.navBar}`}>
									<Text variant="small" className="font-light text-blue-gray-800 ml-2">{`expenses-app-2.vercel.app`}</Text>
								</div>
							</div>
						</div>
						<div className="w-full">
							<Image src={expensesTable} width={400} className="w-full rounded-3xl" alt={`Expenses module`} />
						</div>
					</div>
					<div className={`block lg:hidden ${classes.framerMobile}`}>
						<div className={`${classes.addressBar} flex justify-center items-center`}>
							<div className={`${classes.nav} flex w-full rounded-xl items-center justify-center gap-1`}>
								<FontAwesomeIcon icon={faLock} size="xs" className="mt-0.5" />
								<Text variant="small" className="font-light text-white text-[10px]">expenses-app-2.vercel.app</Text>
							</div>
						</div>
						<div className="w-full">
							<Image src={expensesTableMobile} className="max-h-full w-full rounded-3xl" alt={`Expenses mobile`} />
						</div>
					</div>

				</div>
			</div>
		</section>


		<section id="features" className="max-w-full px-6 mt-20">
			{/* Dashboard */}
			<div className="w-full flex flex-col-reverse lg:flex-row py-20 feature-row">
				<div className="w-full lg:w-1/2 flex flex-col justify-center">
					<div className="w-full flex items-center justify-center p-3">
						<div className="rounded-2xl shadow-sm lg:shadow-md shadow-blue-100 border border-blue-200">
							<Image src={dashboard} alt={`Dashboard preview`} width={500} className="w-full rounded-2xl" />
						</div>
					</div>
				</div>
				<div className="w-full lg:w-1/2 flex justify-center items-center">
					<div className="w-full flex flex-col text-center p-4 gap-2">
						<Text variant="h3" className="text-[1.65rem] drop-shadow-md">{`Your spending, finally visible`}</Text>
						<Text variant="body" className="font-medium">
							{`Your bank tells you what's left.
							 The dashboard tells you the full story, how much you've spent, how much is pending, and where your money actually went.
							  No math required.`}
						</Text>
					</div>
				</div>
			</div>
			{/* Expenses */}
			<div className="w-full flex flex-col lg:flex-row py-20 feature-row">
				<div className="w-full lg:w-1/2 flex justify-center items-center">
					<div className="w-full flex flex-col text-center p-4 gap-2">
						<Text variant="h3" className="text-[1.65rem] drop-shadow-md">{`Don't just trust your memory`}</Text>
						<Text variant="body" className="font-medium">
							{`Even the sharpest memory can miss a $20 purchase from three days ago.
							 Log your expenses as you go and let the app keep track every cash payment, every card transaction, all in one place. Your budget period, always up to date.`}
						</Text>
					</div>
				</div>
				<div className="w-full lg:w-1/2 flex flex-col justify-center">
					<div className="w-full flex items-center justify-center p-3">
						<div className="rounded-2xl shadow-sm lg:shadow-md shadow-blue-100 border border-blue-200">
							<Image src={expensesTable} alt={`Expenses preview`} width={500} className="w-full rounded-2xl" />
						</div>
					</div>
				</div>
			</div>
			{/* Reports */}
			<div className="w-full flex flex-col-reverse lg:flex-row py-20 feature-row">
				<div className="w-full lg:w-1/2 flex flex-col justify-center">
					<div className="w-full flex items-center justify-center p-3">
						<div className="rounded-2xl shadow-sm lg:shadow-md shadow-blue-100 border border-blue-200">
							<Image src={reportsModule} alt={`Reports preview`} width={500} className="w-full rounded-2xl" />
						</div>
					</div>
				</div>
				<div className="w-full lg:w-1/2 flex justify-center items-center">
					<div className="w-full flex flex-col text-center p-4 gap-2">
						<Text variant="h3" className="text-[1.65rem] drop-shadow-md">{`See the full picture`}</Text>
						<Text variant="body" className="font-medium">
							{`You already know rent is your biggest expense. 
							But what's second? Reports breaks down a closed period so you can see exactly where your money went and sometimes the answer is surprising. 
							That daily coffee, those weekend snacks, the small purchases you barely noticed. Seeing them all together is where the real financial awareness begins.`}
						</Text>
					</div>
				</div>
			</div>
		</section>

		<section id="how it works" className="w-full bg-cyan-100 pb-4 lg:pb-2">
			<div className="container lg:py-16 mx-auto text-center  p-3">
				<Text variant="h3" className="mb-12">{`How it works`}</Text>
				<div className="flex flex-wrap justify-center gap-8">
					{stepCards.map((card) => (
						<div key={card.title} className="bg-white border border-blue-gray-50 rounded-lg shadow-md shadow-blue-gray-400 p-8 w-64">
							<div className="mb-6">
								<div className="rounded-full w-16 h-16 bg-blue-100 p-4 inline-flex items-center justify-center">
									<FontAwesomeIcon icon={card.icon} color="blue" size="xl" />
								</div>
							</div>
							<Text variant="h4" className="mb-2">{card.title}</Text>
							{/* <p className="text-gray-600">{card.description}</p> */}
							<Text variant="body" className="text-gray-600">{card.description}</Text>
						</div>
					))}

				</div>

				<div className="mt-12">
					<Button variant="filled" className="filled py-3 px-8 rounded-lg transition ease-in-out hover:scale-105 duration-200"
						onClick={handleGetStartedClick} >
						{`Get Started Now`}
					</Button>
				</div>
			</div>
		</section>
	</>);
}

export default LandingpPage;
