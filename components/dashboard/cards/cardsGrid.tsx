'use client';
import {
	Card,
	CardBody,
	CardFooter,
	Typography,
	Button,
	CardHeader,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import calculatorImg from "@/assets/calculator.jpg";
import moneyImg from "@/assets/money.jpg";
import reports from "@/assets/reports.jpg";
import expensesPhoto from "@/assets/expenses.jpg";


export default function DasboardCards() {
	return (
		<>
			<section className="mb-12 grid gap-y-10 gap-x-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
				<Card className="shadow-blue-100 border border-blue-gray-100 w-full flex-col lg:flex-row">
					<CardHeader shadow={false} floated={false} className="m-0 w-full lg:w-2/5 shrink-0 rounded-r-none">
						<Image className="h-full w-full object-cover" src={calculatorImg} alt="Expenses" priority />
					</CardHeader>
					<CardBody className="flex flex-col gap-10 w-full">
						<div>
							<Typography variant="h4" color="blue-gray" className="mb-2">
								{`Expense Manager`}
							</Typography>
							<Typography color="gray" className="mb-8 font-normal">
								{`Keep track of your spending effortlessly`}
							</Typography>
						</div>
						<Link href="/dashboard/simple-table">
							<Button variant="filled" color="blue" fullWidth >{`Go there`}</Button>
						</Link>
					</CardBody>
				</Card>

				<Card className="shadow-blue-100 border border-blue-gray-100 w-full flex-col lg:flex-row">
					<CardHeader shadow={false} floated={false} className="m-0 w-full lg:w-2/5 shrink-0 rounded-r-none">
						<Image className="h-full w-full object-cover" src={moneyImg} alt="Account" priority />
					</CardHeader>
					<CardBody className="flex flex-col gap-10 w-full">
						<div >
							<Typography variant="h4" color="blue-gray" className="mb-2">
								{`Balance Overview`}
							</Typography>
							<Typography color="gray" className="mb-8 font-normal">
								{`View your account status at a glance`}
							</Typography>
						</div>
						<Typography variant="h3" color="blue-gray" className="mb-2">
							{`Soon`}
						</Typography>
						{/* <Link href="/dashboard/bank-account">
              <Button variant="outlined" color="blue">Comenzar</Button>
            </Link> */}
					</CardBody>
				</Card>
				<Card className="shadow-blue-100 border border-blue-gray-100 w-full flex-col lg:flex-row">
					<CardHeader shadow={true} floated={false} className="m-0 w-full lg:w-2/5 shrink-0 rounded-r-none">
						<Image className="h-full w-full object-cover" src={reports} alt="Cuenta" priority />
					</CardHeader>
					<CardBody className="flex flex-col gap-10 w-full">
						<div >
							<Typography variant="h4" color="blue-gray" className="mb-2">
								{`Spending Analytic`}
							</Typography>
							<Typography color="gray" className="mb-8 font-normal">
								{`Visualize your financial patterns and trends`}
							</Typography>
							<Typography variant="h3" color="blue-gray" className="mb-2">
								{`Soon`}
							</Typography>
						</div>
						{/* <Link href="/dashboard/reports">
              <Button variant="outlined" color="blue">Comenzar</Button>
            </Link> */}
					</CardBody>
				</Card>
			</section>
		</>
	);
}
