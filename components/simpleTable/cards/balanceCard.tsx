'use client';

import { useMoneyFilter } from "@/hooks/useMoneyFilter";
import { Card, CardBody, IconButton } from "@material-tailwind/react";
import classes from '@/styles/summary-card.module.css';
import { Text } from "@/components/ui/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface BalanceCardPropsI {
	text: string;
	value: number;
	alt?: number;
}
const BalanceCard: React.FC<BalanceCardPropsI> = ({ text, value, alt = null }) => {
	const { moneyFilter, formatValue } = useMoneyFilter(value);
	const [isFlipped, setIsFlipped] = useState(false);

	return (<>
		<div data-testid="flipping-card" className={`${alt ? classes['flip-card'] : ''} ${isFlipped ? classes.flipped : ''} w-[48%] lg:w-1/4 flex`}>
			<Card className={`${classes['flip-card-inner']} min-h-28 lg:min-h-32 shadow-blue-100 shadow-md border border-blue-gray-100 flex w-full bg-gradient-to-tr
			from-white ${value > 100 ? 'to-blue-50' : value <= 0 ? 'to-red-100' : 'to-amber-50'}`}>
				<CardBody className={`${classes.front} p-0`}>
					<div className="w-full h-full flex flex-col gap-1 relative">
						{alt && <IconButton className="!absolute top-1 right-0 hover:bg-blue-gray-700/10" variant="text" aria-label="flip card" size="sm" onClick={() => setIsFlipped(prev => !prev)}>
							<FontAwesomeIcon icon={faRotateRight} className="text-blue-700" />
						</IconButton>}
						<div className={`w-full h-full flex flex-col justify-center items-center`}>
							<Text variant="label" className="font-semibold mb-1 mt-1 lg:mb-2 lg:mt-0">{text}</Text>
							<Text variant="h4" className={`p-4 ${value > 100 ? classes.positive : value <= 0 ? classes.negative : classes.warning}`}  >{moneyFilter}</Text>
						</div>
					</div>
				</CardBody>
				{alt && (<CardBody className={`${classes.back} p-0`}>
					<div className="w-full h-full flex flex-col gap-1 relative">
						<IconButton className="!absolute top-1 right-0 hover:bg-blue-gray-700/10" variant="text" aria-label="flip card back" size="sm" onClick={() => setIsFlipped(prev => !prev)}>
							<FontAwesomeIcon icon={faRotateLeft} className="text-blue-700" />
						</IconButton>
						<div className={`w-full h-full flex flex-col justify-center items-center`}>
							<Text variant="label" className="font-semibold mb-1 mt-1 lg:mb-2 lg:mt-0">{`Initial ${text}`}</Text>
							<Text variant="h4" className={`p-4 ${classes.positive}`}  >{formatValue(alt)}</Text>
						</div>
					</div>
				</CardBody>)}
			</Card>
		</div>

	</>)
};

export default BalanceCard;
