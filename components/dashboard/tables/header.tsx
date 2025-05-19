'use client';

import { closeExpensesTable, throwCache } from "@/lib/user/simple-expenses";
import { faArrowLeft, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody, CardFooter, Dialog, DialogBody, IconButton, Navbar, Spinner, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

import { Context, useContext, useState } from "react";
import SimpleExpensesContext from "../../providers/simple-expenses-context";
import { ExpensesTableI } from "@/interfaces/expenses";
import { ExpensesContextValuesI } from "@/interfaces/expensesContext";
import Link from "next/link";

interface DialogPropsI {
	handleOpen: () => void;
	currentExpenses: ExpensesTableI;
	expensesContext: ExpensesContextValuesI;
}

interface DashboardHeaderPropsI {
	hasCurrentData: boolean;
}

const DialogContent: React.FC<DialogPropsI> = ({ handleOpen, currentExpenses, expensesContext }) => {
	const [isFetching, setIsFetching] = useState(false);
	const [message, setMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	async function closeTable() {
		setIsFetching(true);
		const response = await closeExpensesTable(currentExpenses);
		if (response && response.message) {
			setIsFetching(false);
			setMessage(response.message);
			expensesContext.updateExpensesTable(null);
			setTimeout(async () => {
				router.replace('/dashboard');
				// await throwCache();
			}, 2000);
		}
		else if (response && response.error) { setErrorMessage(response.error); }
	}

	return (<>
		<Card className="border border-blue-gray-100 shadow-sm p-3">
			{!isFetching && !message && !errorMessage && <><CardBody>
				<Typography variant="h4" color="blue-gray">
					{`Do you wish to close this expenses period?`}
				</Typography>
			</CardBody>
				<CardFooter>
					<div className="flex flex-row gap-4">
						<Button onClick={closeTable} >{`Close period`}</Button>
						<Button variant="outlined" onClick={handleOpen}>{`Cancel`}</Button>
					</div>
				</CardFooter>
			</>}
			{isFetching && <CardBody>
				<div className="flex flex-col min-w-fit text-center">
					<Spinner className="h-12 w-12 self-center" />
					<Typography variant="paragraph" color="blue-gray">
						{`Closing period...`}
					</Typography>
				</div>
			</CardBody>
			}
			{(message || errorMessage) && <><CardBody>
				<Typography variant="h4" color="blue-gray">
					{message ? message : errorMessage}
				</Typography>
			</CardBody>
				{errorMessage && <CardFooter>
					<div className="flex flex-row gap-4">
						<Button onClick={closeTable} >{`Cancel`}</Button>
					</div>
				</CardFooter>}
			</>}

		</Card>
	</>);
}

export default function DashboardHeader({ hasCurrentData }: DashboardHeaderPropsI) {
	const expensesTableCtx: ExpensesContextValuesI = useContext(SimpleExpensesContext);
	const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
	const [showInstructions, setShowInstructions] = useState(false);
	let currentExpenses: ExpensesTableI = null;
	if (hasCurrentData) currentExpenses = expensesTableCtx.getCurrentExpenses();
	const handleOpen = () => setOpenConfirmationDialog((op) => !op);
	const handleInstructionsOpen = () => setShowInstructions(!showInstructions);
	return (<>
		<div className="lg:hidden flex justify-between px-4 py-3 items-center bg-white">
			<Link href="/dashboard" >
				<FontAwesomeIcon icon={faArrowLeft} size="lg" />
			</Link>
			{hasCurrentData && (<Button variant="outlined" color="blue" size="sm" onClick={handleOpen}>{`Close period`}</Button>)}
			<IconButton variant="text" onClick={handleInstructionsOpen}>
				<FontAwesomeIcon size="lg" icon={faCircleQuestion} />
			</IconButton>
		</div>

		<Navbar className="relative mx-auto max-w-screen-xl px-6 py-3 lg:block hidden">
			<div className="flex items-center justify-between text-blue-gray-900">
				<Typography
					as="a"
					href="/dashboard"
					variant="lead"
					color="blue"
					className="flex gap-2 items-center font-bold cursor-pointer py-1.5 "
				>
					<FontAwesomeIcon icon={faArrowLeft} size="lg" />
					{`Return`}
				</Typography>
				<ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
					{hasCurrentData && <li className="p-1 font-medium">
						<Button variant="text" color="blue" onClick={handleOpen}>
							<span className="text[13px] mt-0.5">{`Close period`}</span>
						</Button>

					</li>}
					<li className="p-1 font-medium">
						<Button variant="text" color="blue" className="flex items-center gap-2" onClick={handleInstructionsOpen}>
							<span className="text[13px] mt-0.5">{`How this works`}</span>
							<FontAwesomeIcon size="lg" icon={faCircleQuestion} />
						</Button>
					</li>
				</ul>
			</div>
		</Navbar>
		<Dialog
			size="xs"
			open={openConfirmationDialog}
			handler={handleOpen}
			className="bg-transparent shadow-none"
		>
			<DialogContent handleOpen={handleOpen} currentExpenses={currentExpenses} expensesContext={expensesTableCtx} />
		</Dialog>
		<Dialog open={showInstructions} handler={handleInstructionsOpen} size="md">
			<DialogBody className="p-6">
				<div className="flex flex-col gap-4">
					<Typography variant="h4" color="blue-gray">How This Works</Typography>
					<Typography color="gray">
						This expense tracker helps you manage your finances by:
					</Typography>
					<ul className="list-disc list-inside space-y-2 text-gray-700">
						<li>Track income from different sources (cash and card)</li>
						<li>Record expenses and categorize by payment method</li>
						<li>Manage pending expenses that need to be paid</li>
						<li>View your remaining balance in real-time</li>
						<li>Close periods to start fresh tracking</li>
					</ul>
					<Typography variant="small" color="gray" className="mt-4">
						More detailed tutorials coming soon!
					</Typography>
					<Button color="blue" variant="filled" onClick={handleInstructionsOpen} className="mt-4">
						Got it
					</Button>
				</div>
			</DialogBody>
		</Dialog>
	</>

	);
}

