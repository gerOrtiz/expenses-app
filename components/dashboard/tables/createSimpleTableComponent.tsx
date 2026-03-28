'use client';
import { IncomeI } from "@/interfaces/expenses";
import { Button, Typography, Dialog, Card, CardBody, CardFooter, IconButton } from "@material-tailwind/react";
import Image from "next/image";
import { useState } from "react";
import emptyClipboard from "@/assets/empty-clipboard.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateTable } from "@/hooks/useCreateTable";


export default function CreateSimpleTableComponent() {
	const [open, setOpen] = useState<boolean>(false);
	const { mutation } = useCreateTable();

	const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid } } =
		useForm<{ cash: string, card: string }>({ mode: 'onTouched', values: { cash: '0', card: '0' } });

	const onSubmit: SubmitHandler<{ cash: string, card: string }> = async (data) => {
		if (!isValid) return;
		const parsedData: IncomeI = { cash: parseFloat(data.cash), card: parseFloat(data.card) };
		if (isNaN(parsedData.cash) || isNaN(parsedData.card)) return;
		await mutation.mutateAsync(parsedData);
		reset();
	};

	const handleOpen = () => setOpen((cur) => !cur);

	return (<>

		<div className="flex flex-col w-full items-center gap-4 p-5 lg:p-0">
			<Image src={emptyClipboard} alt="Empty clipboard" aria-label="Empty clipboard" width={300} />
			<div className="flex flex-col gap-2 items-center ">
				<Typography variant="h3" color="blue-gray">{`Take control of your personal expenses`}</Typography>
				<Typography variant="paragraph" color="gray" className="font-semibold">{`Record your daily expenses and keep track of your budget`}</Typography>
				<Button variant="filled" aria-haspopup="dialog" size="lg" className="filled" onClick={handleOpen}>Create new expenses table</Button>
			</div>

		</div>


		<Dialog
			size="md"
			open={open}
			handler={handleOpen}
			className="bg-transparent shadow-none min-w-[90%] justify-items-center"
			aria-modal
		>
			<form className="mt-8 mb-2 w-full lg:w-3/5 max-w-screen-lg " onSubmit={handleSubmit(onSubmit)}>
				<Card className="mx-auto w-full ">
					<CardBody className="flex flex-col gap-4">
						<div className="flex w-full justify-between items-center">
							<Typography variant="h4" color="blue-gray" id={`:r1g:-label`}>
								{`New expenses table`}
							</Typography>
							<IconButton variant="text" aria-label="close" onClick={handleOpen} >
								<FontAwesomeIcon icon={faTimes} color="blue-gray" size="lg" />
							</IconButton>
						</div>
						<Typography
							className="font-normal"
							variant="paragraph"
							color="gray"
							id={`:r1g:-description`}
						>
							{`Enter initial amounts to get started`}
						</Typography>

						<div className="flex flex-col gap-2">
							<Typography className="lg:mb-1 mr-1 font-semibold" variant="paragraph">
								{`Cash`}:
							</Typography>
							<div className="flex flex-col">
								<label htmlFor="cash" className="text-xs text-gray-900 font-semibold ml-1">{'Amount'}</label>
								<input id="cash" name="cash" type="number" className={`formInput ${errors.cash ? 'inputError' : ''}`} step={0.1}
									{...register('cash', { required: true, min: 0 })} />
								{errors.cash && errors.cash.type === 'required' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
								{errors.cash && errors.cash.type === 'min' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number or zero`}</span>)}
							</div>
							<Typography className="lg:mb-1 mr-1 font-semibold" variant="paragraph">
								{`Card`}:
							</Typography>
							<div className="flex flex-col">
								<label htmlFor="card" className="text-xs text-gray-900 font-semibold ml-1">{'Amount'}</label>
								<input id="card" name="card" type="number" className={`formInput ${errors.card ? 'inputError' : ''}`} step={0.1}
									{...register('card', { required: true, min: 0 })} />
								{errors.card && errors.card.type === 'required' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`This field is required`}</span>)}
								{errors.card && errors.card.type === 'min' &&
									(<span role="alert" className="text-xs text-red-700 font-normal mt-1 text-left">{`Amount must be a positive number or zero `}</span>)}
							</div>
						</div>

					</CardBody>
					<CardFooter className="pt-0 flex justify-center">
						<Button variant="filled" aria-disabled={isSubmitting || !isValid} className="filled" loading={isSubmitting} disabled={isSubmitting || !isValid} type="submit">
							{`Create table`}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Dialog>
	</>);
}
