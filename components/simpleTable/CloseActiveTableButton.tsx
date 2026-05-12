'use client';

import { useCloseActiveTable } from "@/hooks/useCloseActiveTable";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { faTimes, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogBody, DialogFooter, IconButton } from "@material-tailwind/react";
import { useState } from "react";
import { Text } from "../ui/Text";

export default function CloseActiveTableButton() {

	const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
	const dialogRef = useStableDialogA11y(openConfirmationDialog, 'close-period-label', 'close-period-description');
	const { mutation } = useCloseActiveTable();

	const handleOpen = () => setOpenConfirmationDialog((op) => !op);
	const handleCloseTable = async () => {
		const res = await mutation.mutateAsync();
		if (res.ok) {
			setOpenConfirmationDialog(false);
		}
	};
	return (<>
		<Button aria-label={`Close active table`} aria-haspopup={true} variant="filled"
			className="filled transition ease-in-out hover:scale-105 duration-200" onClick={handleOpen} >
			<span className="hidden lg:block text-[13px]">{`Close period`}</span>
			<span className=" block lg:hidden text-[12px]">{`Close`}</span>
		</Button>
		<Dialog
			size="sm"
			open={openConfirmationDialog}
			handler={handleOpen}
			className="bg-white shadow-none "
		>
			<DialogBody ref={dialogRef} className="w-full p-4">
				<div className="flex flex-col w-full gap-3 p-1">
					<div className="flex w-full justify-between items-center">
						<Text variant="h4" id="close-period-label">{`Close expenses period`}</Text>
						<IconButton variant="text" aria-label={`Close dialog`} size="sm" onClick={handleOpen}>
							<FontAwesomeIcon icon={faTimes} color="blue" />
						</IconButton>
					</div>
					<Text variant="body" id="close-period-description">
						{`You're about to close this expenses period.`}
					</Text>
					{/* <Typography color="blue-gray" variant="paragraph" id="close-period-description">
						{`This action can't be undone, do you wish to continue?`}
					</Typography> */}
					<div role="alert" className="flex w-11/12 lg:w-4/5 justify-center self-center p-4 bg-red-100 rounded-md gap-2 items-center">
						<FontAwesomeIcon aria-label="warning icon" icon={faTriangleExclamation} size="lg" color="yellow" />
						{/* <Typography className="font-semibold" color="blue-gray" variant="small" >
							{`This action can't be undone`}
						</Typography> */}
						<Text variant="label" className="font-semibold text-blue-gray-700">{`This action can't be undone`}</Text>
					</div>
					<Text variant="label" className="text-center">
						{`Do you wish to continue?`}
					</Text>
				</div>
			</DialogBody>
			<DialogFooter className="pt-0">
				<div className="w-full flex gap-4 items-center justify-end">
					<Button variant="filled" className="filled" onClick={handleCloseTable} >{`Close period`}</Button>
					<Button variant="outlined" className="outlined" onClick={handleOpen}>{`Cancel`}</Button>
				</div>
			</DialogFooter>
		</Dialog>
	</>);
}
