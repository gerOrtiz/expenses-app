'use client';

import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import classes from '@/styles/summary-card.module.css';

interface BalanceCardPropsI {
	text: string;
	value: number;
}
const BalanceCard: React.FC<BalanceCardPropsI> = ({ text, value }) => {
	const { moneyFilter } = useMoneyFilter(value);

	return (<>
		<div className="w-[48%] lg:w-1/4 flex">
			<Card className="card shadow-blue-100 shadow-md border border-blue-gray-100 flex w-full bg-gradient-to-tr from-white to-blue-50">
				<CardBody className="p-2 lg:p-6">
					<div className="flex flex-col justify-center items-center">
						<Typography variant="paragraph" color="blue-gray" className="mb-1 lg:mb-2 text-xs lg:text-base font-semibold">
							{text}
						</Typography>
						<Typography variant="h4" className={`p-2 lg:p-4 text-lg lg:text-2xl
						 ${value > 100 ? classes.positive : value <= 0 ? classes.negative : classes.warning}`}  >
							{moneyFilter}
						</Typography>
					</div>
				</CardBody>
			</Card>
		</div>

	</>)
};

export default BalanceCard;
