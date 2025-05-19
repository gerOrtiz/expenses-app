'use client';
import { Card } from "@material-tailwind/react";

export default function DashboardSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Skeleton */}
			<div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6">
				<div className="max-w-6xl mx-auto">
					<div className="h-8 bg-gray-300 rounded-md w-48 animate-pulse"></div>
				</div>
			</div>

			{/* Main Content Skeleton */}
			<main className="max-w-6xl mx-auto p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

					{/* Skeleton Cards */}
					{[1, 2, 3, 4].map((index) => (
						<Card key={index} className="shadow-lg animate-pulse">
							<div className="p-6">
								{/* Image placeholder */}
								<div className="h-48 bg-gray-300 rounded-lg mb-4"></div>

								{/* Title placeholder */}
								<div className="h-7 bg-gray-300 rounded w-3/4 mb-3"></div>

								{/* Description placeholders */}
								<div className="space-y-2 mb-6">
									<div className="h-4 bg-gray-300 rounded w-full"></div>
									<div className="h-4 bg-gray-300 rounded w-5/6"></div>
								</div>

								{/* Button placeholder */}
								<div className="h-10 bg-gray-300 rounded-md w-full"></div>
							</div>
						</Card>
					))}

				</div>
			</main>
		</div>
	);
}
