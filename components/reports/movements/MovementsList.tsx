'use client';

import { Text } from "@/components/ui/Text";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { AddedIncomeI } from "@/interfaces/expenses";
import { Card, CardBody } from "@material-tailwind/react";

const formatDate = (timestamp: number) => {
	return new Date(timestamp).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
};

export default function MovementsList({ movements }: { movements: AddedIncomeI[] }) {
	const { formatValue } = useMoneyFilter();
	const totalAdded: { cash: number, card: number, withdrawal: number } = movements.reduce((acc, currentValue) => {
		acc['cash'] += currentValue.cash;
		acc['card'] += currentValue.card;
		acc['withdrawal'] += (currentValue.isWithdrawal ? currentValue.cash : 0);
		return acc;
	}, { card: 0, cash: 0, withdrawal: 0 });

	return (<>
		<div className="p-0">
			<Card className="mb-1 w-full overflow-x-hidden overflow-y-auto shadow-blue-100 border border-blue-gray-100 ">
				<CardBody className="flex flex-col gap-5 p-2 lg:p-6">
					<Text variant="h3">{`Movements`}</Text>
					<div className="space-y-3">
						{movements.map((income, index) => (
							<Card key={index} className="shadow-sm border border-blue-gray-100">
								<CardBody className="p-4">
									<div className="flex justify-between items-center">
										<div className="flex flex-col">
											<Text variant="label" className="font-medium text-blue-gray-800">
												{formatDate(income.date)}
											</Text>
											<Text variant="small">{income.isWithdrawal ? 'Withdrawal' : 'Income Addition'} </Text>
										</div>
										<div className="flex flex-col items-end gap-1">
											{income.cash > 0 && (
												<div className="flex flex-col items-center gap-2">
													<div className="flex item-center gap-2">
														<Text variant="label">{`Cash`}:</Text>
														<Text variant="label" className="font-semibold text-green-800">
															{'+'}{formatValue(income.cash)}
														</Text>
													</div>
													{income.isWithdrawal && (<div className="flex item-center gap-2">
														<Text variant="label">{`Card`}:</Text>
														<Text variant="label" className="font-semibold text-red-700">
															{'-'}{formatValue(income.cash)}
														</Text>
													</div>)}
												</div>
											)}
											{income.card > 0 && (
												<div className="flex items-center gap-2">
													<Text variant="label">{`Card`}:</Text>
													<Text variant="label" className="font-semibold text-green-800">
														{'+'}{formatValue(income.card)}
													</Text>
												</div>
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						))}
					</div>
					<div className="flex flex-col text-center gap-2">
						<span className="text-sm font-semibold text-blue-gray-700">Totals:</span>
						<div className="flex gap-1 justify-center">
							<span className="text-sm  text-blue-gray-600">Cash:</span>
							<span data-testid="totalDisplayed" className="text-sm font-semibold text-lime-900">{formatValue(totalAdded.cash)}</span>
						</div>
						<div className="flex gap-1 justify-center">
							<span className="text-sm  text-blue-gray-600">Card:</span>
							<span data-testid="totalDisplayed" className="text-sm font-semibold text-lime-900">{formatValue(totalAdded.card)}</span>
						</div>
						<div className="flex gap-1 justify-center">
							<span className="text-sm text-blue-gray-600">Withdrawals:</span>
							<span data-testid="totalDisplayed" className="text-sm font-semibold text-lime-900">{formatValue(totalAdded.withdrawal)}</span>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	</>)
}
