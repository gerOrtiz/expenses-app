'use client';

import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogBody, DialogHeader, IconButton } from "@material-tailwind/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Text } from "./Text";

type DateRangeType = {
	startDate: string,
	endDate: string
};

type DateRangeDialogProps = {
	isOpen: boolean,
	handleIsOpen: () => void,
	callback: (a: number, b: number) => void //eslint-disable-line
};

export default function DateRangeDialog({ isOpen, handleIsOpen, callback }: DateRangeDialogProps) {
	const dialogRef = useStableDialogA11y(isOpen, 'date-range-dialog-label', 'date-range-dialog-description');
	const date = new Date();
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
	const today = date.toISOString().split('T')[0];
	const { register, reset, handleSubmit, formState: { isValid, isSubmitting } } =
		useForm<DateRangeType>({
			mode: 'onTouched',
			values: { startDate: firstDay, endDate: today }
		});

	const onSubmit: SubmitHandler<DateRangeType> = async (inputData) => {
		const start = new Date(inputData.startDate + 'T00:00').setHours(0, 1, 0, 0);
		const end = new Date(inputData.endDate + 'T00:00').setHours(23, 59, 0, 0);
		callback(start, end);
		reset();
	}

	return (<>
		<Dialog size="sm"
			open={isOpen}
			handler={handleIsOpen}
			className="bg-white shadow-none min-w-[90%]"
			ref={dialogRef} >
			<DialogHeader>
				<div className="flex w-full justify-between items-center">
					<Text id="date-range-dialog-label" variant="h4">{`Date range`}</Text>
					<IconButton variant="text" aria-label={`Close edit dialog`} size="sm" onClick={handleIsOpen}>
						<FontAwesomeIcon icon={faTimes} color="blue" />
					</IconButton>
				</div>
			</DialogHeader>
			<DialogBody className="pt-0">
				<div className="flex w-full flex-col gap-3 p-1">
					<Text variant="body" id="date-range-dialog-description">{`Update pending expense details`}</Text>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="w-full flex gap-3">
							<div className="flex flex-col" >
								<label htmlFor="start-date" className="text-xs text-blue-gray-800 font-semibold ml-1">{'Start date'}</label>
								<input id="start-date" type="date" className="formInput" {...register('startDate', { required: true })} />
							</div>
							<div className="flex flex-col" >
								<label htmlFor="end-date" className="text-xs text-blue-gray-800 font-semibold ml-1">{'End date'}</label>
								<input id="end-date" type="date" className="formInput" {...register('endDate', { required: true })} />
							</div>
						</div>
						<div className="flex justify-end gap-3 mt-6">
							<Button
								variant="filled"
								className="filled"
								type="submit"
								disabled={isSubmitting || !isValid}
								loading={isSubmitting}
							>
								{`Continue`}
							</Button>
							<Button
								variant="outlined"
								className="outlined"
								onClick={handleIsOpen}
								disabled={isSubmitting}
							>
								{`Cancel`}
							</Button>
						</div>
					</form>
				</div>
			</DialogBody>
		</Dialog>
	</>);
}
