'use client';
import { Spinner } from "@material-tailwind/react";

export default function TSpinner() {
  return <div className="grid justify-items-center">
    <Spinner className="h-12 w-12" />
  </div>
}