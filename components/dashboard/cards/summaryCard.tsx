'use client';

import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";

export default function SummaryCard() {
	return (<>
		<div className="w-full flex">
			<Card className="w-full bg-blue-50/40">
				<CardHeader className="bg-transparent" floated={false} shadow={false}>
					<Typography variant="h4" >{`Summary`}</Typography>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-4 divide-x-2 divide-blue-400">
						<div className="flex flex-col gap-2" >
							<Typography variant="h5">{`This month`}</Typography>
							<Typography variant="paragraph">$3,250</Typography>
						</div>
						<div className="flex flex-col gap-2" >
							<Typography variant="h5">{`Budget`}</Typography>
							<Typography variant="paragraph">65% used</Typography>
						</div>
						<div className="flex flex-col gap-2" >
							<Typography variant="h5">{`Latest expenses`}</Typography>
							<Typography variant="paragraph">8 transactions</Typography>
						</div>
						<div className="flex flex-col gap-2" >
							<Typography variant="h5">{`Current balance`}</Typography>
							<Typography variant="paragraph">$12,450</Typography>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	</>)
}
