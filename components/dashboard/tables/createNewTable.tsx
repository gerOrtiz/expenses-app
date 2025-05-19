'use client';
import { IncomeI } from "@/interfaces/expenses";
import { Button, Typography, Dialog, Card, CardBody, CardFooter, Input, IconButton } from "@material-tailwind/react";
import Image from "next/image";
import { useState } from "react";
import emptyClipboard from "@/assets/empty-clipboard.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


interface TableViewPropsI {
	submitHandler: (rawForm: IncomeI) => void;
}

export default function TableView({ submitHandler }: TableViewPropsI) {
	const [open, setOpen] = useState<boolean>(false);
	const [pending, setPending] = useState<boolean>(false);
	const [cashRef, setCashRef] = useState<number>(0);
	const [cardRef, setCardRef] = useState<number>(0);
	const handleOpen = () => setOpen((cur) => !cur);

	function createTable(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPending(true);
		const rawFormData = {
			cash: cashRef,
			card: cardRef
		}
		return submitHandler(rawFormData);
	}

	const handleCashValueChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const stringValue = ev.target.value as string;
		const value = parseInt(stringValue) || 0;
		setCashRef(value);
	};


	const handleCardValueChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const stringValue = ev.target.value as string;
		const value = parseInt(stringValue) || 0;
		setCardRef(value);
	};

	return (<>
		<div className="flex flex-col w-full items-center gap-4 p-5 lg:p-0">
			<Image src={emptyClipboard} alt="Empty clipboard" aria-label="Empty clipboard" width={300} />
			<div className="flex flex-col gap-2 items-center ">
				<Typography variant="h3" color="blue-gray">{`Take control of your personal expenses`}</Typography>
				<Typography variant="h6" color="gray">{`Record your daily expenses and keep track of your budget`}</Typography>
				<Button color="blue" size="lg" className="hover:bg-blue-600" onClick={handleOpen}>Create new expenses table</Button>
			</div>

		</div>


		<Dialog
			size="sm"
			open={open}
			handler={handleOpen}
			className="bg-transparent shadow-none min-w-[90%]"
		>
			<form className="mt-8 mb-2 w-full max-w-screen-lg " onSubmit={createTable}>
				<Card className="mx-auto w-full max-w-[24rem]">
					<CardBody className="flex flex-col gap-4">
						<div className="flex w-full justify-between items-center">
							<Typography variant="h4" color="blue-gray">
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
						>
							{`Enter initial amounts to get started`}
						</Typography>

						<div className="flex flex-col items-left">
							<Typography className="mb-1" variant="h6">
								{`Cash`}
							</Typography>
							<label htmlFor="cash" className="text-xs text-gray-900 font-semibold">{'Amount'}</label>
							<Input
								id="cash" name="cash"
								type="number"
								className="!rounded-lg !border-blue-600 !border-2 p-3"
								color="blue"
								labelProps={{ className: 'hidden' }}
								min={0}
								step={0.1}
								value={cashRef}
								onChange={handleCashValueChange}
								size="lg" crossOrigin={undefined} />
						</div>

						<div className="flex flex-col items-left">
							<Typography className="mb-1" variant="h6">
								{`Card`}
							</Typography>
							<label htmlFor="card" className="text-xs text-gray-900 font-semibold">{'Amount'}</label>
							<Input
								id="card"
								name="card"
								type="number"
								className="!rounded-lg !border-blue-600 !border-2 p-3"
								color="blue"
								labelProps={{ className: 'hidden' }}
								min={0}
								step={0.1}
								value={cardRef}
								onChange={handleCardValueChange}
								size="lg" crossOrigin={undefined} />
						</div>
					</CardBody>
					<CardFooter className="pt-0 flex justify-center">
						<Button variant="filled" color="blue" className="hover:bg-blue-600" loading={pending} disabled={pending || (cashRef == 0 && cardRef == 0)} type="submit">
							{`Create table`}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Dialog>
	</>);
}
