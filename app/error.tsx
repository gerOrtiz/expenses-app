'use client';

import { Text } from "@/components/ui/Text";
import { Button } from "@material-tailwind/react";
import { useEffect } from "react";

export default function Error({ error, reset }: {
	error: Error & { digest?: string }
	reset: () => void
}) {

	useEffect(() => {
		console.error(error);
	}, [error]);
	return <main className="error flex justify-self-center justify-center ">
		<div className="w-full flex flex-col items-center p-1 gap-7">
			<h1>{`An error ocurred!`}</h1>
			<Text variant="body" className="text-lg">{`Failed to fetch data. Please try again later.`}</Text>
			<Text variant="label" className="text-red-800">{` ${error || 'Error: Failed to perform fetch'}`}</Text>
			<div className="flex w-full justify-center">
				<Button variant="filled" className="filled" onClick={() => reset()}>{`Try again`}</Button>
			</div>
		</div>

	</main>;
}
