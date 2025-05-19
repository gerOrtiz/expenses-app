'use client';

import { Alert, Button, Input, Typography } from "@material-tailwind/react";
import { useRef, useState } from "react";

export default function DateFilter(props) {
  const sDate = useRef();
  const fDate = useRef();
  const [sDateHasError, setSDateHasError] = useState(false);
  const [fDateHasError, setFDateHasError] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const setDates = (ev) => {
    ev.preventDefault();
    setSDateHasError(false);
    setFDateHasError(false);
    if (!sDate.current || !sDate.current.value) setSDateHasError(true);
    if (!fDate.current || !fDate.current.value) setFDateHasError(true);
    if (sDate.current.value && fDate.current.value) {
      let newDateFilter = { sDate: new Date(sDate.current.value).setUTCHours(0, 1, 0), fDate: new Date(fDate.current.value).setUTCHours(23, 59, 0) };
      props.setDateFilter(newDateFilter);
    }
  };

  const getNewDates = () => {
    const newDates = { sDate: new Date(sDate.current.value).getTime(), fDate: new Date(fDate.current.value).getTime() };
    return newDates;
  };

  const validate = () => {
    if (!sDate.current.value || !fDate.current.value) return;
    setFDateHasError(false);
    setShowErrorMessage(false);
    const newDates = getNewDates();
    if (newDates.fDate < newDates.sDate) {
      setFDateHasError(true);
      setShowErrorMessage(true);
    }
  };

  return (<>
    <div className="flex mt-4 gap-4">
      <Typography variant="lead" className="mb-2">Elige un rango de fechas: </Typography>
      <form onSubmit={setDates}>
        <div className="flex flex-row gap-4">
          <Input type="date"
            label="Fecha inicio"
            inputRef={sDate}
            error={sDateHasError}
            onChange={validate}
            className="bg-white shadow-lg text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent"
            containerProps={{
              className: "min-w-0",
            }} />
          <Input type="date"
            label="Fecha final"
            inputRef={fDate}
            onChange={validate}
            className="bg-white shadow-lg text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent"
            error={fDateHasError}
            containerProps={{
              className: "min-w-0",
            }} />
          <Button className="flex-shrink-0" variant="outlined" type="submit" disabled={showErrorMessage}>Mostrar</Button>
        </div>
      </form>
    </div>
    {showErrorMessage && <Typography
      variant="small"
      color="red"
      className="flex items-center justify-center font-normal">
      Error: El rango de fecha final no puede ser menor al inicial
    </Typography>}
  </>);
}