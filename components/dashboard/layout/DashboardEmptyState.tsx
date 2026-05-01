'use client';

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardEmptyState() {
	return (
		<div className="flex flex-col items-center gap-8 py-16 px-6">

			<div className="flex items-center justify-center w-44 h-44 rounded-full border border-blue-gray-100 bg-blue-50">
				{/* <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="16" y="20" width="56" height="64" rx="4" fill="#B5D4F4" stroke="#378ADD" strokeWidth="1.5" />
					<rect x="28" y="22" width="16" height="8" rx="2" fill="#378ADD" />
					<rect x="24" y="34" width="32" height="3" rx="1.5" fill="#378ADD" opacity="0.5" />
					<rect x="24" y="42" width="24" height="3" rx="1.5" fill="#378ADD" opacity="0.5" />
					<rect x="24" y="50" width="28" height="3" rx="1.5" fill="#378ADD" opacity="0.5" />
					<rect x="24" y="58" width="18" height="3" rx="1.5" fill="#378ADD" opacity="0.5" />
					<circle cx="68" cy="68" r="16" fill="#1976d2" />
					<rect x="67" y="61" width="2" height="14" rx="1" fill="white" />
					<rect x="61" y="67" width="14" height="2" rx="1" fill="white" />
				</svg> */}
				<Image src="/add-files.svg" alt={`Alt files illustration`} width={100} height={100} />
			</div>

			<div className="flex flex-col items-center gap-2 text-center">
				<Typography variant="h2" className="font-medium text-blue-800" >{`No active expenses table`}</Typography>
				<p className="text-normal text-blue-gray-600 max-w-sm leading-relaxed">
					Start a new period to track your spending, set your budget, and stay on top of your finances.
				</p>
			</div>

			<Link href="/simple-table">
				<Button variant="filled" className="filled flex items-center gap-3">
					<FontAwesomeIcon icon={faPlus} color="white" size="lg" />
					{`Create expenses table`}
				</Button>
			</Link>


			<span className="text-sm text-blue-gray-600">
				{`You'll be taken to the expenses module to get started.`}
			</span>

		</div>
	)
}
