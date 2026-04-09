'use client';

import { useCloseActiveTable } from "@/hooks/useCloseActiveTable";
import { useStableDialogA11y } from "@/hooks/useStableDialogA11y";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogBody, DialogFooter, IconButton, Typography } from "@material-tailwind/react";
import { useState } from "react";

export default function CloseTableButton() {

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
		<Button aria-label={`Close active table`} aria-haspopup={true} variant="filled" className="filled" onClick={handleOpen} >
			<span className="hidden lg:block text-[13px]">{`Close period`}</span>
			<span className=" block lg:hidden text-[12px]">{`Close`}</span>
		</Button>
		<Dialog
			size="md"
			open={openConfirmationDialog}
			handler={handleOpen}
			className="bg-white shadow-none min-w-[90%]"
		>
			<DialogBody ref={dialogRef} className="w-full p-4">
				<div className="flex flex-col w-full gap-3 p-1">
					<div className="flex w-full justify-between items-center">
						<Typography variant="h5" className="text-blue-800" id="close-period-label">
							{`Close expenses period`}
						</Typography>
						<IconButton variant="text" aria-label={`Close dialog`} size="sm" onClick={handleOpen}>
							<FontAwesomeIcon icon={faTimes} color="blue-gray" />
						</IconButton>
					</div>
					<Typography color="blue-gray" variant="paragraph" id="close-period-description">
						{`This action can't be undone, do you wish to continue?`}
					</Typography>
				</div>

			</DialogBody>
			<DialogFooter>
				<div className="flex flex-row gap-4">
					<Button variant="filled" className="filled" onClick={handleCloseTable} >{`Close period`}</Button>
					<Button variant="outlined" className="outlined" onClick={handleOpen}>{`Cancel`}</Button>
				</div>
			</DialogFooter>
		</Dialog>
	</>);
}
