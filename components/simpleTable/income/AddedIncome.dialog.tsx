'use client';
import { Text } from "@/components/ui/Text";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { AddedIncomeI } from "@/interfaces/expenses";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogBody, IconButton, Card, CardBody, DialogFooter, Button } from "@material-tailwind/react";

interface AddedIncomeDialogPropsI {
	addedIncome: AddedIncomeI[];
	isOpen: boolean;
	handleOpen: () => void;
}

export default function AddedIncomeDialog({ addedIncome, isOpen, handleOpen }: AddedIncomeDialogPropsI) {
	const dialogRef = useStableDialogA11y(isOpen, 'income-dialog-label', 'income-dialog-description');
	const { formatValue } = useMoneyFilter();

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	return (
		<Dialog
			size="sm"
			open={isOpen}
			handler={handleOpen}
			className="bg-white shadow-none min-w-[90%]"
		>
			<DialogBody ref={dialogRef} className="w-full p-4">
				<div className="flex flex-col w-full gap-3 p-1">
					<div className="flex w-full justify-between items-center">
						<Text variant="h4" id="income-dialog-label">{`Added Income`}</Text>
						<IconButton variant="text" aria-label="close" size="sm" onClick={handleOpen}>
							<FontAwesomeIcon icon={faTimes} size="1x" color="blue" />
						</IconButton>
					</div>
					<Text variant="body" id="income-dialog-description" className="mt-1">{`History of income additions and withdrawals`}</Text>

					<div className="mt-3 max-h-96 overflow-y-auto">
						{addedIncome.length === 0 ? (
							<div className="text-center py-8">
								<Text variant="label">
									{`No income additions yet`}
								</Text>
							</div>
						) : (
							<div className="space-y-3">
								{addedIncome.map((income, index) => (
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
						)}
					</div>
				</div>
			</DialogBody>
			<DialogFooter className="flex justify-end">
				<Button variant="outlined" className="outlined" onClick={handleOpen}	>
					{`Close`}
				</Button>
			</DialogFooter>
		</Dialog>
	);
}
