'use client';

import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { Card, CardBody } from "@material-tailwind/react";
import classes from '@/styles/summary-card.module.css';
import { Text } from "@/components/ui/Text";

interface BalanceCardPropsI {
	text: string;
	value: number;
}
const BalanceCard: React.FC<BalanceCardPropsI> = ({ text, value }) => {
	const { moneyFilter } = useMoneyFilter(value);

	return (<>
		<div className="w-[48%] lg:w-1/4 flex">
			<Card className="card shadow-blue-100 shadow-md border border-blue-gray-100 flex w-full bg-gradient-to-tr from-white to-blue-50">
				<CardBody className="p-3 lg:p-6">
					<div className="flex flex-col justify-center items-center">
						<Text variant="label" className="font-semibold mb-1 mt-1 lg:mb-2 lg:mt-0">{text}</Text>
						<Text variant="h4" className={`p-4 ${value > 100 ? classes.positive : value <= 0 ? classes.negative : classes.warning}`}  >{moneyFilter}</Text>
					</div>
				</CardBody>
			</Card>
		</div>

	</>)
};

export default BalanceCard;
