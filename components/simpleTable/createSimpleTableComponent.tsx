'use client';
import { IncomeI } from "@/interfaces/expenses";
import { Button, Dialog, Card, CardBody, CardFooter, IconButton } from "@material-tailwind/react";
import Image from "next/image";
import { useState } from "react";
import emptyClipboard from "@/assets/empty-clipboard.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateTable } from "@/hooks/useCreateTable";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import logoImg from '@/assets/transparent-logo.png';
import { Text } from "../ui/Text";


export default function CreateSimpleTableComponent() {
	const [open, setOpen] = useState<boolean>(false);
	const dialogRef = useStableDialogA11y(open, 'create-table-label', 'create-table-description');
	const { mutation } = useCreateTable();

	const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid }, getValues } =
		useForm<{ cash: number, card: number }>({ mode: 'onTouched', values: { cash: 0, card: 0 } });

	const onSubmit: SubmitHandler<{ cash: number, card: number }> = async (data) => {
		if (!isValid) return;
		const parsedData: IncomeI = { cash: data.cash, card: data.card };
		if (isNaN(parsedData.cash) || isNaN(parsedData.card)) return;
		await mutation.mutateAsync(parsedData);
		reset();
	};

	const validateAtLeastOnePositive = () => {
		const values = getValues();
		const isOnePositive = [values.card, values.cash].some((num) => num > 0);
		return isOnePositive || 'At least one method must be positive';
	};

	const handleOpen = () => {
		reset();
		setOpen((cur) => !cur)
	};

	return (<>

		<div className="flex flex-col w-full items-center gap-4 p-5 lg:p-0 h-fit mt-4 lg:mt-10">
			<Image src={emptyClipboard} alt="Empty clipboard" aria-label="Empty clipboard" width={300} />
			<div className="flex flex-col gap-3 items-center ">
				<Text variant="h3" >{`Take control of your personal expenses`}</Text>
				{/* <Typography variant="h3" className="text-blue-800">{`Take control of your personal expenses`}</Typography> */}
				<Text variant="body">{`Record your daily expenses and keep track of your budget`}</Text>
				{/* <Typography variant="paragraph" color="blue-gray" className="font-semibold">{`Record your daily expenses and keep track of your budget`}</Typography> */}
				<Button variant="filled" aria-haspopup="dialog" size="md"
					className="filled mt-3 transition ease-in-out hover:scale-105 duration-200"
					onClick={handleOpen}>
					{`Create new expenses table`}
				</Button>
			</div>

			<div className="w-full flex justify-center mt-10 lg:mt-20">
				<Image src={logoImg} alt="Expenses app logo" width={400} className="opacity-30" />
			</div>
		</div>


		<Dialog
			size="md"
			open={open}
			handler={handleOpen}
			className="bg-transparent shadow-none min-w-[90%] justify-items-center"
			aria-modal
			ref={dialogRef}
		>
			<form className="mt-8 mb-2 w-full lg:w-3/5 max-w-screen-lg " onSubmit={handleSubmit(onSubmit)}>
				<Card className="mx-auto w-full ">
					<CardBody className="flex flex-col gap-4">
						<div className="flex w-full justify-between items-center">
							<Text variant="h4" id="create-table-label">{`New expenses table`}</Text>
							<IconButton variant="text" aria-label="close" size="sm" onClick={handleOpen} >
								<FontAwesomeIcon icon={faTimes} color="blue" />
							</IconButton>
						</div>
						<Text variant="body" id="create-table-description" >
							{`Enter initial amounts to get started`}
						</Text>

						<div className="flex flex-col gap-2">
							<Text variant="label" className="lg:mb-1 mr-1">{`Cash`}:</Text>
							<div className="flex flex-col">
								<label htmlFor="cash" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Amount'}</label>
								<input id="cash" name="cash" type="number" className={`formInput ${errors.cash ? 'inputError' : ''}`} step={0.1}
									{...register('cash', { required: true, min: 0, valueAsNumber: true })} />
								{errors.cash && errors.cash.type === 'required' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
								{errors.cash && errors.cash.type === 'min' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number or zero`}</span>)}

							</div>

							<Text variant="label" className="lg:mb-1 mr-1">{`Card`}:</Text>
							<div className="flex flex-col">
								<label htmlFor="card" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Amount'}</label>
								<input id="card" name="card" type="number" className={`formInput ${errors.card ? 'inputError' : ''}`} step={0.01}
									{...register('card', { required: true, min: 0, valueAsNumber: true, validate: validateAtLeastOnePositive })} />
								{errors.card && errors.card.type === 'required' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
								{errors.card && errors.card.type === 'min' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number or zero `}</span>)}
								{errors.card && errors.card.message &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{errors.card.message || 'One method must be positive'}</span>)}
							</div>
						</div>

					</CardBody>
					<CardFooter className="pt-0 flex justify-end">
						<Button variant="filled" aria-disabled={isSubmitting || !isValid} className="filled" loading={isSubmitting} type="submit" disabled={isSubmitting || !isValid}>
							{`Create table`}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Dialog>
	</>);
}
