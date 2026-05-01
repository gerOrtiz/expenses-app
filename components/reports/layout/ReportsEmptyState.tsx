'use client';

import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import noData from "@/assets/no-data.jpg";

export default function ReportsEmptyState() {
	return (
		<div data-testid="reports-empty-state" className="flex flex-col items-center gap-8 py-16 px-6">

			<div className="flex items-center justify-center w-44 h-44 rounded-full border border-blue-gray-100 bg-blue-50">

				<Image src={noData} alt={`No data illustration`} width={100} height={100} />
			</div>

			<div className="flex flex-col items-center gap-2 text-center">
				<Typography variant="h2" className="font-medium text-blue-800" >{`No data available`}</Typography>
				<p className="text-normal text-blue-gray-600 max-w-sm leading-relaxed">
					{`Try with a different date range or come back when you close an expenses period`}
				</p>
			</div>
		</div>
	)
}
