'use client';
import { Card } from "@material-tailwind/react";

export default function DashboardSkeleton() {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50 gap-8 mt-8 p-8">

			<div className="flex w-3/4 lg:w-1/2 h-12 rounded-md bg-gray-300 animate-pulse" />

			<div className="w-full flex flex-col lg:flex-row items-stretch gap-5">
				<div className=" w-full lg:w-1/2 flex flex-col gap-5 border border-blue-100 bg-gray-50 rounded-md p-4">
					<div className="flex flex-col items-start gap-3 mb-4 ">
						<div className="flex flex-col items-start gap-3 mb-4">
							<div className="w-24 h-5 bg-gray-300 animate-pulse"></div>
							<div className="w-28 h-10 bg-gray-300 animate-pulse"></div>
						</div>
					</div>

					<div className="flex w-full items-center justify-center gap-5">
						<div className="w-36 h-10 bg-gray-300 animate-pulse" />
						<div className="w-40 h-10  bg-gray-300 animate-pulse" />
					</div>
				</div>
				<div className="w-full flex flex-col border border-blue-100 bg-gray-50 rounded-md p-4 justify-center">
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
			</div>

			<div className="w-full items-center grid grid-cols-3 gap-4">
				{[1, 2, 3].map((index) => (
					<div key={index} className="col-span-3 lg:col-span-1 border border-blue-gray-500 shadow rounded-lg w-full p-4 flex flex-col gap-4 justify-center items-center">
						<div className="w-40 h-12 lg:p-4 bg-gray-300 animate-pulse" />
						<div className="w-full  h-80 bg-gray-300 animate-pulse" />
					</div>

				))}
			</div>


		</div>
	);
}
