'use client';
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { TotalsI, TotalsType } from "@/interfaces/expenses";
import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	Card,
	CardBody,
	Typography
} from "@material-tailwind/react";
import { useState } from "react";


interface TotalsTablePropsI {
	data: TotalsI;
}

export default function TotalsTables({ data }: TotalsTablePropsI) {
	return (
		// <div className="relative flex flex-wrap lg:flex-nowrap overflow-hidden gap-4 lg:col-span-3 md:col-span-2 col-span-1 mt-4 p-3">
		<div className="relative flex flex-row lg:flex-col  overflow-hidden gap-2 lg:gap-4  mt-1 lg:mt-4 p-3">
			{data && (<>
				<SingleTable tableTitle={`Total spent`} data={data.total_expenses} />
				<SingleTable tableTitle={`Payments to make`} data={data.total_pending} />
				<SingleTable tableTitle={`Payments made`} data={data.total_payments_made} />
			</>)
			}
		</div>
	);
}

const SingleTable: React.FC<{ tableTitle: string, data: TotalsType }> = ({ tableTitle, data }) => {
	const total = useMoneyFilter(data.card + data.cash);
	const cashFormatted = useMoneyFilter(data.cash);
	const cardFormatted = useMoneyFilter(data.card);
	const [openAccordion, setOpenAccordion] = useState(false);

	const handleOpenAccordion = () => {
		setOpenAccordion(cur => !cur);
	};

	return (
		<Card className="mb-0 lg:mb-1 w-full overflow-hidden shadow-blue-100 border border-blue-gray-100 h-fit">
			<CardBody className="p-3 lg:p-6">
				<section className="relative flex flex-col gap-2">
					<Accordion open={openAccordion}>
						<AccordionHeader onClick={handleOpenAccordion}>
							<div className="flex flex-col lg:flex-row w-full justify-around gap-2 lg:gap-0">
								<Typography variant="h6" color="gray" className="text-xs lg:text-base">{tableTitle}:</Typography>
								<Typography variant="h6" color="blue-gray" className="text-xs lg:text-base">{total}</Typography>
							</div>
						</AccordionHeader>
						<AccordionBody>
							<div className="flex flex-col gap-2 lg:gap-0">
								<div className="flex flex-col lg:flex-row w-full justify-around gap-1 lg:gap-0">
									<Typography variant="paragraph" color="gray" className="text-xs lg:text-base">
										{`Cash`}
									</Typography>
									<Typography variant="paragraph" color="blue-gray" className="font-semibold text-xs lg:text-base" >
										{cashFormatted}
									</Typography>
								</div>
								<div className="flex flex-col lg:flex-row w-full justify-around gap-1 lg:gap-0">
									<Typography variant="paragraph" color="gray" className="text-xs lg:text-base">
										{`Card`}
									</Typography>
									<Typography variant="paragraph" color="blue-gray" className="font-semibold text-xs lg:text-base" >
										{cardFormatted}
									</Typography>
								</div>
							</div>
						</AccordionBody>
					</Accordion>
					{/* <div className="flex w-full justify-around">
						<Typography variant="h6" color="gray">{tableTitle}:</Typography>
						<Typography variant="h6" color="blue-gray">{total}</Typography>
					</div>

					<div className="flex flex-col">
						<div className="flex w-full justify-around">
							<Typography variant="paragraph" color="gray" >
								{`Cash`}
							</Typography>
							<Typography variant="paragraph" color="blue-gray" className="font-semibold" >
								{cashFormatted}
							</Typography>
						</div>
						<div className="flex w-full justify-around">
							<Typography variant="paragraph" color="gray" >
								{`Card`}
							</Typography>
							<Typography variant="paragraph" color="blue-gray" className="font-semibold" >
								{cardFormatted}
							</Typography>
						</div>
					</div> */}

				</section>
			</CardBody>
		</Card>
	);
};
