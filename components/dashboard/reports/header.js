'use client';

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar, Typography } from "@material-tailwind/react";

export default function ReportsHeader() {
  return (<>
    <Navbar className="mx-auto max-w-screen-xl px-6 py-3">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="/dashboard"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
          Regresar a tablero
        </Typography>
      </div>
    </Navbar>
  </>);
}