'use client';

import { Text } from "@/components/ui/Text";
import { useAddIncome } from "@/hooks/useAddIncome";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Dialog,
	Tabs,
	TabsHeader,
	Tab,
	TabsBody,
	TabPanel,
	IconButton,
	DialogHeader,
	DialogBody
} from "@material-tailwind/react";
import { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IncomeFormPropsI {
	isOpen: boolean;
	handleOpen: Dispatch<SetStateAction<boolean>>;
	cardAmountRemaining?: number;
}

type IncomeFormValues = {
	cash: number,
	card: number,
	withdrawal: number
};



export default function AddIncomeDialog({ isOpen, handleOpen, cardAmountRemaining = 0 }: IncomeFormPropsI) {
	const dialogRef = useStableDialogA11y(isOpen, 'income-dialog-label', 'income-dialog-description');
	const [isWithdrawalView, setIsWithdrawalView] = useState<boolean>(true);
	const { register, handleSubmit, reset, formState: { errors, isSubmitting }, getValues } =
		useForm<IncomeFormValues>({ mode: 'onSubmit', values: { card: 0, cash: 0, withdrawal: 1 } });
	const { register: withdrawalRegister, handleSubmit: submitWithdrawal, reset: resetWithdrawal,
		formState: { errors: err, isSubmitting: isSubmittingWithdrawal, isValid }
	} = useForm<{ withdrawal: number }>({ mode: 'onChange', values: { withdrawal: 1 } });

	const { mutation } = useAddIncome();

	const validateAtLeastOnePositive = () => {
		if (isWithdrawalView) return true;
		const values = getValues();
		const isOnePositive = [values.card, values.cash].some((num) => num > 0);
		return isOnePositive || 'At least one number must be positive';
	};

	const switchView = (isWithdrawal: boolean) => {
		setIsWithdrawalView(isWithdrawal);

	};

	const onSubmit: SubmitHandler<IncomeFormValues> = async (data) => {
		const newIncome = {
			cash: isWithdrawalView ? data.withdrawal : data.cash,
			card: isWithdrawalView ? 0 : data.card,
			isWithdrawal: isWithdrawalView,
			date: new Date().getTime()
		};
		const res = await mutation.mutateAsync({ newIncomeData: newIncome });
		if (res.ok) {
			handleOpen(false);
			reset();
			resetWithdrawal();
		}
	};


	const newIncome = (<>
		<form onSubmit={handleSubmit(onSubmit)} >
			<div className="flex flex-col gap-3">
				<span className="text-sm lg:text-[15px] text-blue-gray-600 antialiased text-center">{`Add a new income for either cash or card`}</span>
				<div className="flex flex-col items-left">
					<label htmlFor="cash" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Cash'}</label>
					<input id="cash" name="cash" type="number" className={`formInput ${errors.cash ? 'inputError' : ''}`} step={0.1}
						{...register('cash', { required: true, min: 0, valueAsNumber: true, validate: validateAtLeastOnePositive })} />
					{errors.cash && errors.cash.type === 'required' &&
						(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
					{errors.cash && errors.cash.type === 'min' &&
						(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number or zero`}</span>)}
					{errors.cash && errors.cash.message &&
						(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{errors.cash.message || 'One number must be positive'}</span>)}

				</div>
				<div className="flex flex-col items-left">
					<label htmlFor="card" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Card'}</label>
					<input id="card" name="card" type="number" className={`formInput ${errors.card ? 'inputError' : ''}`} step={0.01}
						{...register('card', { required: true, min: 0, valueAsNumber: true })} />
					{errors.card && errors.card.type === 'required' &&
						(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
					{errors.card && errors.card.type === 'min' &&
						(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number or zero `}</span>)}
				</div>
				<div className="flex w-full justify-end gap-4 mt-4">
					<Button variant="filled" className="filled"
						loading={isSubmitting}
						disabled={isSubmitting}
						type="submit">
						{`Add`}
					</Button>
					<Button variant="outlined" className="outlined" onClick={() => handleOpen(false)}>
						{`Cancel`}
					</Button>
				</div>
			</div>
		</form>

	</>);

	const newWithdrawal = (<>
		<form onSubmit={submitWithdrawal(onSubmit)} >
			<div className="flex flex-col gap-4">
				<span className="text-sm lg:text-[15px] text-blue-gray-600 antialiased">
					{`This amount will be taken from your card income and goes to cash income.`}
				</span>
				<div className="flex flex-col items-left">
					<label htmlFor="withdrawal" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Amount'}</label>
					<input id="withdrawal" name="withdrawal" type="number" className={`formInput ${err.withdrawal ? 'inputError' : ''}`} step={0.1}
						{...withdrawalRegister('withdrawal', { required: true, min: 0.1, valueAsNumber: true, max: cardAmountRemaining })} />
					{err.withdrawal && err.withdrawal.type === 'required' &&
						(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
					{err.withdrawal && err.withdrawal.type === 'min' &&
						(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number`}</span>)}
					{err.withdrawal && err.withdrawal.type === 'max' &&
						(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount can't be higher than the remaining in card ($${cardAmountRemaining})`}</span>)}
				</div>
				<div className="flex w-full justify-end gap-4 mt-4">
					<Button variant="filled" className="filled"
						loading={isSubmittingWithdrawal}
						disabled={isSubmittingWithdrawal || !isValid}
						type="submit">
						{`Withdraw`}
					</Button>
					<Button variant="outlined" className="outlined" onClick={() => handleOpen(false)}>
						{`Cancel`}
					</Button>
				</div>
			</div>
		</form>
	</>);

	return (<>
		<Dialog
			size="xs"
			open={isOpen}
			handler={() => handleOpen(false)}
			className="bg-white shadow-none !max-w-screen-lg !w-96"
			ref={dialogRef}
		>
			<DialogHeader className="p-6 pb-0">
				<div className="flex w-full justify-between items-center">
					<Text variant="h4" id="income-dialog-label">{`Add income`}</Text>
					<IconButton aria-label="Close modal" variant="text" size="sm" onClick={() => handleOpen(false)}>
						<FontAwesomeIcon icon={faTimes} color="blue" />
					</IconButton>
				</div>
			</DialogHeader>
			<DialogBody className="min-w-full p-6 pb-1">
				<div className="w-full flex flex-col gap-4">
					<Text variant="body" id="income-dialog-description">{`Withdraw from card or directly add a new income for either payment method`}</Text>
					<div className="mt-2 mb-2">
						<Tabs value="withdrawal">
							<TabsHeader>
								<Tab value="withdrawal" onClick={() => switchView(true)}>
									<span className="font-semibold text-blue-800"> {`Withdrawal`}</span>
								</Tab>
								<Tab value="income" onClick={() => switchView(false)}>
									<span className="font-semibold text-blue-800">{`Income`}</span>
								</Tab>
							</TabsHeader>
							<TabsBody
								animate={{
									initial: { y: 250 },
									mount: { y: 0 },
									unmount: { y: 250 },
								}}
							>
								<TabPanel value="withdrawal" className="w-full p-2">
									{newWithdrawal}
								</TabPanel>
								<TabPanel value="income" className="w-full pt-3 pb-2 px-2">
									{newIncome}
								</TabPanel>
							</TabsBody>
						</Tabs>
					</div>
				</div>
			</DialogBody>
		</Dialog>
	</>);
}
