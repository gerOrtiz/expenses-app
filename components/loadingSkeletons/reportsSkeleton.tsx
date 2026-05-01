'use client';

import { Card } from "@material-tailwind/react";


export default function ReportsSkeleton() {
	return (
		<div className="min-h-screen w-[99dvw] flex flex-col bg-gray-50 p-4">
			{/* Header/ Title */}
			<div className="w-full grid grid-cols-3 my-3 lg:my-4 p-4 lg:p-5 gap-2">
				<div className="col-span-3 lg:col-span-1">
					<div className="w-1/2 lg:w-full h-12 bg-gray-300 animate-pulse rounded-md" />
				</div>
				<div className="col-span-3 lg:col-span-1">
					<div className="w-3/4 lg:w-full h-12 bg-gray-300 animate-pulse rounded-md" />
				</div>
				<div className="col-span-3 lg:col-span-1 justify-items-start lg:justify-items-end content-center">
					<div className="w-2/5 h-10 bg-gray-300 animate-pulse rounded-md" />
				</div>
			</div>
			{/* Cards */}
			<div className="w-full lg:w-4/5 flex self-center justify-center bg-gray-50 rounded-md p-4">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
					{[1, 2, 3, 4].map((index) => (
						<Card key={index} className="card col-span-1 shadow-blue-100 shadow-md border border-blue-100 animate-pulse">
							<div className="p-6 flex flex-col justify-center items-center">
								<div className="w-24 h-5 mb-1 lg:mb-2 bg-gray-300 animate-pulse" />
								<div className="w-28 h-16 p-2 lg:p-4 bg-gray-300 animate-pulse" />
							</div>
						</Card>
					))}
				</div>
			</div>
			{/* Charts */}
			<div className="w-full mt-4 lg:mt-8 p-3 lg:p-8">
				<div className="w-full flex flex-wrap gap-3">
					<div className="basis-full lg:basis-[30%] h-80 bg-gray-300 animate-pulse rounded-md" />
					<div className="basis-full lg:basis-[30%] h-96 bg-gray-300 animate-pulse rounded-md" />
					<div className="basis-full lg:basis-[30%] h-80 bg-gray-300 animate-pulse rounded-md" />
				</div>
			</div>

			{/* Expenses table & chart */}
			<div className="w-full flex flex-col gap-8 mt-4 lg:mt-8 p-4 lg:p-8">
				<div className="w-full flex flex-col lg:flex-row gap-5">
					<div className="w-full lg:w-7/12 h-[500px] rounded-md bg-gray-300 animate-pulse" />
					<div className="w-full lg:w-7/12 h-[500px] rounded-md bg-gray-300 animate-pulse" />
				</div>
			</div>

			{/* Pending and movement */}
			<div className="flex w-full justify-center">
				<div className="w-3/4 lg:w-2/3 flex flex-wrap gap-6 justify-center lg:justify-normal">
					<div className="basis-full lg:basis-1/2 h-72 rounded-md bg-gray-300 animate-pulse" />
					<div className="basis-11/12 lg:basis-2/5 h-72 rounded-md bg-gray-300 animate-pulse" />
				</div>
			</div>

		</div>
	);
}
