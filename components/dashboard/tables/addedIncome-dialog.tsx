'use client';
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { AddedIncomeI } from "@/interfaces/expenses";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Typography, DialogBody, IconButton, Card, CardBody } from "@material-tailwind/react";

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
						<Typography variant="h5" className="text-blue-800" id="income-dialog-label">
							{`Added Income`}
						</Typography>
						<IconButton variant="text" aria-label="close" onClick={handleOpen}>
							<FontAwesomeIcon icon={faTimes} size="lg" color="blue-gray" />
						</IconButton>
					</div>

					<Typography variant="paragraph" id="income-dialog-description" color="blue-gray" className="mt-1">
						{`History of income additions and withdrawals`}
					</Typography>

					<div className="mt-3 max-h-96 overflow-y-auto">
						{addedIncome.length === 0 ? (
							<div className="text-center py-8">
								<Typography color="gray" variant="paragraph">
									{`No income additions yet`}
								</Typography>
							</div>
						) : (
							<div className="space-y-3">
								{addedIncome.map((income, index) => (
									<Card key={index} className="shadow-sm border border-blue-gray-100">
										<CardBody className="p-4">
											<div className="flex justify-between items-center">
												<div className="flex flex-col">
													<Typography variant="small" color="blue-gray" className="font-medium">
														{formatDate(income.date)}
													</Typography>
													<Typography variant="small" color="gray" className="text-xs">
														{income.isWithdrawal ? 'Withdrawal' : 'Income Addition'}
													</Typography>
												</div>
												<div className="flex flex-col items-end gap-1">
													{income.cash > 0 && (
														<div className="flex flex-col items-center gap-2">
															<div className="flex item-center gap-2">
																<Typography variant="small" color="blue-gray" className="font-normal">
																	{`Cash`}:
																</Typography>
																<Typography
																	variant="small"
																	className="font-semibold text-green-800"
																>
																	{'+'}{formatValue(income.cash)}
																</Typography>
															</div>
															{income.isWithdrawal && (<div className="flex item-center gap-2">
																<Typography variant="small" color="blue-gray" className="font-normal">
																	{`Card`}:
																</Typography>
																<Typography
																	variant="small"
																	className="font-semibold text-red-700"
																>
																	{'-'}{formatValue(income.cash)}
																</Typography>
															</div>)}
														</div>
													)}
													{income.card > 0 && (
														<div className="flex items-center gap-2">
															<Typography variant="small" color="blue-gray" className="font-normal">
																{`Card`}:
															</Typography>
															<Typography
																variant="small"
																color={income.isWithdrawal ? "red" : "green"}
																className="font-medium"
															>
																{'+'}{formatValue(income.card)}
															</Typography>
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
		</Dialog>
	);
}
