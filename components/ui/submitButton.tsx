'use client'

import { Button } from '@material-tailwind/react';
import { useFormStatus } from 'react-dom'

interface SubmitButtonPropsI {
	text: string;
}

export default function SubmitButton({ text }: SubmitButtonPropsI) {
	const { pending } = useFormStatus();
	return (
		<Button variant="filled" color="blue" className="hover:bg-blue-600" disabled={pending}>
			{pending ? 'Registering...' : text}
		</Button>
		// <button disabled={pending}>
		//   {pending ? 'Registrando...' : text}
		// </button>
	);
}
