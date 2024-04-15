'use client';

import { closeExpensesTable, throwCache } from "@/lib/user/simple-expenses";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody, CardFooter, Dialog, Navbar, Spinner, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

import { useContext, useState } from "react";
import SimpleExpensesContext from "../providers/simple-expenses-context";

function DialogContent({ handleOpen, currentExpenses, expensesContext }) {
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  async function closeTable() {
    setIsFetching(true);
    const response = await closeExpensesTable(currentExpenses);
    setIsFetching(false);
    if (response && response.message) {
      setMessage(response.message);
      expensesContext.updateExpensesTable(null);
      setTimeout(async () => {
        await throwCache();
        router.replace('/dashboard');
      }, 2000);
    }
    else if (response && response.error) { setErrorMessage(response.error); }
  }

  return (<>
    <Card className="border border-blue-gray-100 shadow-sm p-3">
      {!isFetching && !message && !errorMessage && <><CardBody>
        <Typography variant="h4" color="blue-gray">
          ¿Deseas cerrar este periodo de gastos?
        </Typography>
      </CardBody>
        <CardFooter>
          <div className="flex flex-row gap-4">
            <Button onClick={closeTable} >Aceptar</Button>
            <Button variant="outlined" onClick={handleOpen}>Cancelar</Button>
          </div>
        </CardFooter>
      </>}
      {isFetching && <CardBody>
        <div className="flex flex-col min-w-fit text-center">
          <Spinner className="h-12 w-12 self-center" />
          <Typography variant="paragraph" color="blue-gray">
            Cerrando periodo...
          </Typography>
        </div>
      </CardBody>
      }
      {(message || errorMessage) && <><CardBody>
        <Typography variant="h4" color="blue-gray">
          {message ? message : errorMessage}
        </Typography>
      </CardBody>
        {errorMessage && <CardFooter>
          <div className="flex flex-row gap-4">
            <Button onClick={closeTable} >Cancelar</Button>
          </div>
        </CardFooter>}
      </>}

    </Card>
  </>);
}

export default function DashboardHeader({ hasCurrentData }) {
  const expensesTableCtx = useContext(SimpleExpensesContext);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  let currentExpenses;
  if (hasCurrentData) currentExpenses = expensesTableCtx.getCurrentExpenses();
  const handleOpen = () => setOpenConfirmationDialog((op) => !op);
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
          {hasCurrentData && <li className="p-1 font-medium">
            <Button variant="text" onClick={handleOpen}>Cerrar periodo</Button>
            <Dialog
              size="xs"
              open={openConfirmationDialog}
              handler={handleOpen}
              className="bg-transparent shadow-none"
            >
              <DialogContent handleOpen={handleOpen} currentExpenses={currentExpenses} expensesContext={expensesTableCtx} />
            </Dialog>
          </li>}
          <li className="p-1 font-medium">
            <Button variant="text">Bucar tabla anterior</Button>
          </li>
        </ul>
      </div>
    </Navbar>
  );
}