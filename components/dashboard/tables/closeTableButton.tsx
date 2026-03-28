'use client';

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody, CardFooter, Dialog, DialogBody, IconButton, Typography } from "@material-tailwind/react";
import { useState } from "react";

export default function CloseTableButton() {
	const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

	const handleOpen = () => setOpenConfirmationDialog((op) => !op);
	const mockClose = () => { return; };
	return (<>
		<Button variant="filled" className="filled" onClick={handleOpen} >
			<span className="hidden lg:block text-[13px]">{`Close period`}</span>
			<span className=" block lg:hidden text-[12px]">{`Close`}</span>
		</Button>
		<Dialog
			size="md"
			open={openConfirmationDialog}
			handler={handleOpen}
			className="bg-transparent shadow-none"
		>
			<DialogBody>
				<Card className="border border-blue-gray-100 shadow-sm p-3">
					<div className="flex absolute right-2">
						<IconButton className=" justify-self-end" variant="text" aria-label="close dialog" onClick={handleOpen} >
							<FontAwesomeIcon icon={faTimes} color="blue-gray" size="lg" />
						</IconButton>
					</div>
					<CardBody>
						<Typography id=":r0:-label" variant="h3" color="blue">Close expenses period</Typography>
						<Typography id=":r0:-description" variant="h4" color="blue-gray">
							{`Do you wish to close this expenses period?`}
						</Typography>
					</CardBody>
					<CardFooter>
						<div className="flex flex-row gap-4">
							<Button variant="filled" className="filled" onClick={mockClose} >{`Close period`}</Button>
							<Button variant="outlined" className="outlined" onClick={handleOpen}>{`Cancel`}</Button>
						</div>
					</CardFooter>
				</Card>
			</DialogBody>
		</Dialog>
	</>);
}
