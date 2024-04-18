'use client';

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Navbar, Typography } from "@material-tailwind/react";
import { useState } from "react";
import CategoriesDialog from "../categories/categories-dialog";


export default function AccountHeader() {
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  return (
    <Navbar className="mx-auto max-w-screen-xl px-6 py-3">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="/dashboard"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
          Regresar
        </Typography>
        <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
          <li className="p-1 font-medium">
            <Button variant="text" onClick={() => setShowCategoriesDialog((cur) => !cur)}>Categorías</Button>
            {showCategoriesDialog && <CategoriesDialog />}
          </li>
          <li className="p-1 font-medium">
            <Button variant="text">Cerrar periodo</Button>
          </li>
        </ul>
      </div>
    </Navbar>
  );
}