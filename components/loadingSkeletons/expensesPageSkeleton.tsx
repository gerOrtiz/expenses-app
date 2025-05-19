'use client';

import { Card } from "@material-tailwind/react";

export default function ExpensesPageSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Skeleton - already sticky */}
			<div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
				<div className="flex justify-between items-center p-4">
					<div className="h-6 bg-gray-300 rounded w-20 animate-pulse"></div>
					<div className="flex gap-3">
						<div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
						<div className="h-8 bg-gray-300 rounded w-32 animate-pulse"></div>
					</div>
				</div>
			</div>

			<div className="p-4 space-y-6">
				{/* Balance Section Skeleton */}
				<Card className="shadow-lg animate-pulse">
					<div className="p-6">
						<div className="flex justify-between items-center mb-6">
							<div className="h-7 bg-gray-300 rounded w-20"></div>
							<div className="h-9 bg-gray-300 rounded w-28"></div>
						</div>

						{/* Balance Cards Grid */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							{[1, 2, 3, 4].map((index) => (
								<Card key={index} className="border border-gray-200">
									<div className="p-4 text-center">
										<div className="h-5 bg-gray-300 rounded w-16 mx-auto mb-3"></div>
										<div className="h-8 bg-gray-300 rounded w-24 mx-auto"></div>
									</div>
								</Card>
							))}
						</div>

						{/* Latest Income Section */}
						<Card className="border border-gray-200">
							<div className="p-4">
								<div className="flex justify-between items-center mb-2">
									<div className="h-5 bg-gray-300 rounded w-24"></div>
									<div className="h-5 bg-gray-300 rounded w-32"></div>
								</div>
								<div className="flex justify-between items-center mb-3">
									<div className="h-5 bg-gray-300 rounded w-28"></div>
									<div className="h-5 bg-gray-300 rounded w-20"></div>
								</div>
								<div className="text-center">
									<div className="h-6 bg-gray-300 rounded w-32 mx-auto"></div>
								</div>
							</div>
						</Card>
					</div>
				</Card>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Current Expenses Table Skeleton */}
					<div className="lg:col-span-2">
						<Card className="shadow-lg animate-pulse">
							<div className="p-6">
								<div className="flex justify-between items-center mb-4">
									<div className="h-6 bg-gray-300 rounded w-40"></div>
									<div className="h-9 bg-gray-300 rounded w-28"></div>
								</div>

								{/* Table Header */}
								<div className="grid grid-cols-5 gap-4 p-3 bg-gray-100 rounded-t-lg">
									<div className="h-4 bg-gray-300 rounded w-20"></div>
									<div className="h-4 bg-gray-300 rounded w-16"></div>
									<div className="h-4 bg-gray-300 rounded w-24"></div>
									<div className="h-4 bg-gray-300 rounded w-16"></div>
									<div className="h-4 bg-gray-300 rounded w-8"></div>
								</div>

								{/* Table Rows */}
								{[1, 2, 3, 4].map((index) => (
									<div key={index} className="grid grid-cols-5 gap-4 p-3 border-b border-gray-100">
										<div className="h-4 bg-gray-300 rounded w-16"></div>
										<div className="h-4 bg-gray-300 rounded w-20"></div>
										<div className="h-4 bg-gray-300 rounded w-12"></div>
										<div className="h-4 bg-gray-300 rounded w-20"></div>
										<div className="flex gap-2">
											<div className="h-4 w-4 bg-gray-300 rounded"></div>
											<div className="h-4 w-4 bg-gray-300 rounded"></div>
										</div>
									</div>
								))}
							</div>
						</Card>
					</div>

					{/* Right Side Panels */}
					<div className="space-y-6">
						{/* Total Spent Card */}
						<Card className="shadow-lg animate-pulse">
							<div className="p-4 text-center">
								<div className="h-5 bg-gray-300 rounded w-24 mx-auto mb-3"></div>
								<div className="h-8 bg-gray-300 rounded w-28 mx-auto"></div>
							</div>
						</Card>

						{/* Payments to Make Card */}
						<Card className="shadow-lg animate-pulse">
							<div className="p-4 text-center">
								<div className="h-5 bg-gray-300 rounded w-32 mx-auto mb-3"></div>
								<div className="h-8 bg-gray-300 rounded w-28 mx-auto"></div>
							</div>
						</Card>

						{/* Payments Made Card */}
						<Card className="shadow-lg animate-pulse">
							<div className="p-4 text-center">
								<div className="h-5 bg-gray-300 rounded w-28 mx-auto mb-3"></div>
								<div className="h-8 bg-gray-300 rounded w-20 mx-auto"></div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
