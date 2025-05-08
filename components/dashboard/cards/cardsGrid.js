'use client';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  CardHeader,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import calculatorImg from "@/assets/calculator.jpg";
import moneyImg from "@/assets/money.jpg";
import reports from "@/assets/reports.jpg";

export default function DasboardCards() {
  return (
    <>
      <section className="mb-12 grid gap-y-10 gap-x-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
        <Card className="border border-blue-gray-100 shadow-sm w-full flex-row">
          <CardHeader shadow={false} floated={false} className="m-0 w-2/5 shrink-0 rounded-r-none">
            <Image className="h-full w-full object-cover" src={calculatorImg} alt="Gastos" priority />
          </CardHeader>
          <CardBody className="flex flex-col gap-10 w-full">
            <div>
              <Typography variant="h4" color="blue-gray" className="mb-2">
                Control de gastos
              </Typography>
              <Typography color="gray" className="mb-8 font-normal">
                Lleva el control total de tus gastos comunes.
              </Typography>
            </div>
            <Link href="/dashboard/simple-table">
              <Button variant="outlined" color="blue">Comenzar</Button>
            </Link>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm w-full flex-row">
          <CardHeader shadow={false} floated={false} className="m-0 w-2/5 shrink-0 rounded-r-none">
            <Image className="h-full w-full object-cover" src={moneyImg} alt="Cuenta" priority />
          </CardHeader>
          <CardBody className="flex flex-col gap-10 w-full">
            <div >
              <Typography variant="h4" color="blue-gray" className="mb-2">
                Cuenta personal
              </Typography>
              <Typography color="gray" className="mb-8 font-normal">
                Manten al día los movimientos de tu cuenta
              </Typography>
            </div>
            <Link href="/dashboard/bank-account">
              <Button variant="outlined" color="blue">Comenzar</Button>
            </Link>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm w-full flex-row">
          <CardHeader shadow={true} floated={false} className="m-0 w-2/5 shrink-0 rounded-r-none">
            <Image className="h-full w-full object-cover" src={reports} alt="Cuenta" priority />
          </CardHeader>
          <CardBody className="flex flex-col gap-10 w-full">
            <div >
              <Typography variant="h4" color="blue-gray" className="mb-2">
                Reportes
              </Typography>
              <Typography color="gray" className="mb-8 font-normal">
                Genera estadisticas con la información de tus gastos
              </Typography>
              {/* <Typography variant="h3" color="blue-gray" className="mb-2">
                Próximamente
              </Typography> */}
            </div>
            <Link href="/dashboard/reports">
              <Button variant="outlined" color="blue">Comenzar</Button>
            </Link>
          </CardBody>
        </Card>
      </section>
    </>
  );
}