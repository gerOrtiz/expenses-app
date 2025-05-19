'use client';

import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { Card, CardBody, Typography } from "@material-tailwind/react";

interface BalanceCardPropsI {
	text: string;
	value: number;
}
const BalanceCard: React.FC<BalanceCardPropsI> = ({ text, value }) => {
	const formattedAmount = useMoneyFilter(value);

	return (<>
		<div className="w-[48%] lg:w-1/4 flex">
			<Card className="shadow-blue-100 border border-blue-gray-100 flex w-full">
				<CardBody className="p-2 lg:p-6">
					<div className="flex flex-col justify-center items-center">
						<Typography variant="h6" color="blue-gray" className="mb-1 lg:mb-2 text-xs lg:text-base">
							{text}
						</Typography>
						<Typography variant="h4" className="p-2 lg:p-4 text-lg lg:text-2xl" color={value > 1 ? "green" : "red"} >
							{formattedAmount}
						</Typography>
					</div>
				</CardBody>
			</Card>
		</div>

	</>)
};

export default BalanceCard;
