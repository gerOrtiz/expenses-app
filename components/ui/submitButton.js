'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton({ text }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Registrando...' : text}
    </button>
  );
}