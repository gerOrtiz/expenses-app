'use client';

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Navbar, Typography } from "@material-tailwind/react";
import { useState } from "react";
import CategoriesDialog from "../categories/categories-dialog";
import CloseAccountPeriod from "./close-dialog";


export default function AccountHeader() {
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
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
            <Button id="add-categories" variant="text" onClick={() => setShowCategoriesDialog(true)}>Categorías</Button>
            {showCategoriesDialog && <CategoriesDialog closeHandler={setShowCategoriesDialog} />}
          </li>
          <li className="p-1 font-medium">
            <Button id="close-period" variant="text" onClick={() => setShowCloseDialog(true)}>Cerrar periodo</Button>
            {showCloseDialog && <CloseAccountPeriod closeHandler={setShowCloseDialog} />}
          </li>
        </ul>
      </div>
    </Navbar>
  );
}