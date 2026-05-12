'use client';
import { Text } from "@/components/ui/Text";
import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { TotalsI, TotalsType } from "@/interfaces/expenses";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Accordion,
	AccordionBody,
	AccordionHeader,
	Card,
	CardBody,
} from "@material-tailwind/react";
import { useState } from "react";


interface TotalsTablePropsI {
	data: TotalsI;
}

export default function TotalsTables({ data }: TotalsTablePropsI) {
	return (<>
		{/* <div className="relative flex flex-wrap lg:flex-nowrap overflow-hidden gap-4 lg:col-span-3 md:col-span-2 col-span-1 mt-4 p-3"> */}
		<Text variant="h4" className="text-start">Totals</Text>
		<div className="relative flex flex-row lg:flex-col items-start overflow-hidden gap-2 lg:gap-4  mt-1 lg:mt-4 p-0 py-1 lg:p-3">
			{data && (<>
				<SingleTable tableTitle={`Total spent`} data={data.total_expenses} />
				<SingleTable tableTitle={`Payments to make`} data={data.total_pending} />
				<SingleTable tableTitle={`Payments made`} data={data.total_payments_made} />
			</>)
			}
		</div>
	</>);
}

const SingleTable: React.FC<{ tableTitle: string, data: TotalsType }> = ({ tableTitle, data }) => {
	const { formatValue } = useMoneyFilter();
	const total = formatValue(data.card + data.cash);
	const cashFormatted = formatValue(data.cash);
	const cardFormatted = formatValue(data.card);
	const [openAccordion, setOpenAccordion] = useState(false);

	const handleOpenAccordion = () => {
		setOpenAccordion(cur => !cur);
	};

	return (
		<Card className="mb-0 lg:mb-1 w-full shadow-sm lg:shadow-md overflow-hidden shadow-blue-100 border border-blue-gray-100 h-fit">
			<CardBody className="p-3 lg:p-6 ">
				<section className="relative flex flex-col gap-2 ">
					<Accordion open={openAccordion} icon={<FontAwesomeIcon aria-label="Accordion caret" icon={openAccordion ? faAngleUp : faAngleDown} />}>
						<AccordionHeader onClick={handleOpenAccordion} className="flex flex-col lg:flex-row py-1 lg:py-4 text-center lg:text-start">

							<div className="flex flex-col lg:flex-row w-full justify-between lg:justify-around items-center gap-2 lg:gap-0">
								<Text variant="label" className="text-blue-gray-700 font-semibold text-sm lg:text-base">{tableTitle}:</Text>
								<Text variant="h5">{total}</Text>
							</div>
						</AccordionHeader>
						<AccordionBody>
							<div className="flex flex-col gap-3">
								<div className="flex flex-col lg:flex-row w-full justify-around gap-1 lg:gap-0">
									<Text variant="label" className="lg:text-[15px]">{`Cash`}</Text>
									<Text variant="label" className="font-semibold lg:text-[15px] text-indigo-500">
										{cashFormatted}
									</Text>
								</div>
								<div className="flex flex-col lg:flex-row w-full justify-around gap-1 lg:gap-0">
									<Text variant="label" className="lg:text-[15px]">	{`Card`}</Text>
									<Text variant="label" className="font-semibold lg:text-[15px] text-indigo-500">
										{cardFormatted}
									</Text>
								</div>
							</div>
						</AccordionBody>
					</Accordion>
				</section>
			</CardBody>
		</Card>
	);
};
