'use client';

import { useAddIncome } from "@/hooks/useAddIncome";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Typography,
	Dialog,
	Tabs,
	TabsHeader,
	Tab,
	TabsBody,
	TabPanel,
	IconButton
} from "@material-tailwind/react";
import { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IncomeFormPropsI {
	isOpen: boolean;
	handleOpen: Dispatch<SetStateAction<boolean>>;
	dataCallback?: () => void;
}

type IncomeFormValues = {
	cash: number,
	card: number,
	withdrawal: number
};



export default function AddIncomeDialog({ isOpen, handleOpen }: IncomeFormPropsI) {
	const dialogRef = useStableDialogA11y(isOpen, 'income-dialog-label', 'income-dialog-description');
	const [isWithdrawalView, setIsWithdrawalView] = useState<boolean>(true);
	const { register, handleSubmit, reset, formState: { errors, isSubmitting }, getValues } =
		useForm<IncomeFormValues>({ mode: 'onSubmit', values: { card: 0, cash: 0, withdrawal: 1 } });

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
		}
	};


	const newIncome = (<>
		<div className="flex flex-col gap-3">
			<Typography variant="small" color="blue-gray">
				{`Add a new income for either cash or card`}
			</Typography>
			<div className="flex flex-col items-left">
				<label htmlFor="cash" className="text-xs text-gray-900 font-semibold ml-1">{'Cash'}</label>
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
				<label htmlFor="card" className="text-xs text-gray-900 font-semibold ml-1">{'Card'}</label>
				<input id="card" name="card" type="number" className={`formInput ${errors.card ? 'inputError' : ''}`} step={0.01}
					{...register('card', { required: true, min: 0, valueAsNumber: true })} />
				{errors.card && errors.card.type === 'required' &&
					(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
				{errors.card && errors.card.type === 'min' &&
					(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number or zero `}</span>)}
			</div>
		</div>
	</>);

	const newWithdrawal = (<>
		<div className="flex flex-col gap-3">
			<Typography variant="small" color="blue-gray">
				{`This amount will be taken from your card income and goes to cash income.`}
			</Typography>
			<div className="flex flex-col items-left">
				<label htmlFor="withdrawal" className="text-xs text-gray-900 font-semibold ml-1">{'Amount'}</label>
				<input id="withdrawal" name="withdrawal" type="number" className={`formInput ${errors.withdrawal ? 'inputError' : ''}`} step={0.1}
					{...register('withdrawal', { required: true, min: 0.1, valueAsNumber: true })} />
				{errors.withdrawal && errors.withdrawal.type === 'required' &&
					(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
				{errors.withdrawal && errors.withdrawal.type === 'min' &&
					(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number`}</span>)}
			</div>
		</div>
	</>);

	return (<>
		<Dialog
			size="xs"
			open={isOpen}
			handler={() => handleOpen(false)}
			className="bg-transparent shadow-none min-w-[90%]"
			ref={dialogRef}
		>
			<form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit(onSubmit)} >
				<Card className="mx-auto w-full max-w-[24rem]">
					<CardBody className="flex flex-col gap-4">
						<div className="flex w-full justify-between items-center">
							<Typography variant="h5" className="text-blue-800" id="income-dialog-label">{`Add income`}</Typography>
							<IconButton aria-label="Close modal" variant="text" size="sm" onClick={() => handleOpen(false)}>
								<FontAwesomeIcon icon={faTimes} color="blue-gray" />
							</IconButton>
						</div>
						<Typography variant="paragraph" id="income-dialog-description" color="blue-gray">{`Withdraw from card or directly add a new income for either payment method`}</Typography>
						<Tabs value="withdrawal">
							<TabsHeader>
								<Tab value="withdrawal" onClick={() => switchView(true)}>
									<span className="font-semibold text-blue-800"> {`Withdrawal`}</span>
								</Tab>
								<Tab value="income" onClick={() => switchView(false)}>
									<span className="font-semibold text-blue-800">{`Income`}</span>
								</Tab>
							</TabsHeader>
							<TabsBody>
								<TabPanel value="withdrawal" className="w-full">
									{newWithdrawal}
								</TabPanel>
								<TabPanel value="income" className="w-full">
									{newIncome}
								</TabPanel>
							</TabsBody>
						</Tabs>
					</CardBody>
					<CardFooter className="pt-0">
						<div className="flex w-full justify-end gap-4">
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
					</CardFooter>
				</Card>
			</form>
		</Dialog>
	</>);
}
