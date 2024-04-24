'use client';

import AccountDataContext from "@/components/providers/account-recurrent-context";
import { closeAccountPeriod, throwAccountCache } from "@/lib/user/account-movements";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Spinner, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";


export default function CloseAccountPeriod({ closeHandler }) {
  const [openDialog, setOpenDialog] = useState(true);
  const [isSubmtting, setIsSubmitting] = useState(false);
  const [successClose, setSuccessClose] = useState(false);
  const router = useRouter();
  const accountRecurrentCtx = useContext(AccountDataContext);
  const handleOpen = () => {
    if (closeHandler) closeHandler(false);
    setOpenDialog(false);
  }

  async function closePeriod() {
    setIsSubmitting(true);
    const res = await closeAccountPeriod();
    setIsSubmitting(false);
    if (res.message) {
      setSuccessClose(true);
      accountRecurrentCtx.updateAccountData(null);
      setTimeout(async () => {
        router.replace('/dashboard');
        //await throwAccountCache();
      }, 1500);
    }
  }

  return (<>
    <Dialog size="sm" open={openDialog} handler={handleOpen} >
      <DialogHeader className="flex flex-col gap-4">
        <Typography variant="h5" color="blue-gray">
          Estás a punto de cerrar este periodo
        </Typography>
        <Typography color="gray" variant="paragraph">
          Está acción no se puede deshacer
        </Typography>
      </DialogHeader>
      <DialogBody >
        {!isSubmtting && successClose &&
          <div className="flex flex-col text-center">
            <Typography variant="h1" color="green">
              <FontAwesomeIcon icon={faCheckCircle} />
            </Typography>
            <Typography variant="lead" color="green">Periodo cerrado</Typography>
          </div>}
        {isSubmtting &&
          <div className="flex flex-col text-center items-center">
            <Spinner className="h-12 w-12" />
            <Typography variant="lead" >Cerrando periodo...</Typography>
          </div>}
      </DialogBody>
      <DialogFooter>
        <Button variant="outlined" color="green" disabled={isSubmtting || successClose} onClick={closePeriod}>Continuar</Button>
      </DialogFooter>
    </Dialog>
  </>);
}