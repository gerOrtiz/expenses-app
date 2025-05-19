'use client';

import { Button, Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";

export default function ReportTypeGrid(props) {


  return (<>
    <section className="mb-12 grid gap-x-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
      <Card className="mt-6 w-96 justify-self-end">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Control de gastos
          </Typography>
          <Typography>
            Genera reportes con los datos guardados de periodos cerrados de la tabla &quot;Control de gastos&quot;.
          </Typography>
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="outlined" onClick={() => props.setReportType(1)}>Comenzar</Button>
        </CardFooter>
      </Card>

      <Card className="mt-6 w-96">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Cuenta personal
          </Typography>
          <Typography>
            Genera reportes con los gastos guardados de periodos cerrados de la tabla &quot;Cuenta personal&quot;.
          </Typography>
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="outlined" onClick={() => props.setReportType(2)}>Comenzar</Button>
        </CardFooter>
      </Card>

    </section>
  </>);
}