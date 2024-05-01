'use client';

import Image from "next/image";
import logoImage from "@/assets/logo-big.png"
import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col py-2">
        <main className="relative flex-1 container text-center p-0 m-auto my-6 overflow-x-hidden overflow-auto">
          {/* <section className="flex grid xl:grid-cols-3 sm:grid-cols-2 w-full mb-6 mt-6 p-4">
            <Image src={logoImage} alt="Logo" className="w-full object-cover" priority />
            <div className="flex flex-col gap-6 xl:col-span-2">
              <Typography variant="h1" color="blue" textGradient className="uppercase font-bold text-6xl">
                Expenses app
              </Typography>

              <Typography variant="h3" color="indigo" className="font-normal">
                Con Expenses App llevarás el control absoluto de tus finanzas de una manera sencilla.
              </Typography>
              <Typography variant="h3" color="indigo" className="font-normal">
                Podrás tener el control de gastos diarios; el de tu cuenta personal, generar reportes y más.
              </Typography>
              <Typography variant="h3" color="indigo" className="font-normal">
                Lo único que debes hacer es crear una cuenta o iniciar sesión
              </Typography>
              <Link href="/user">
                <Button size="lg" color="blue">Comienza aquí</Button>
              </Link>
            </div>
          </section> */}
          <section className="flex">
            <Card className="w-full flex p-4 m-4 flex-row">
              <CardHeader shadow={false}
                floated={false}
                className="m-0 w-2/5 shrink-0 rounded-r-none">
                <Image src={logoImage} alt="Logo" className="w-full object-cover" priority />
              </CardHeader>
              <CardBody>
                <div className="flex flex-col gap-6">
                  <Typography variant="h1" color="blue" textGradient className="uppercase font-bold text-6xl">
                    Expenses app
                  </Typography>

                  <Typography variant="h3" color="indigo" className="font-normal">
                    Con Expenses App llevarás el control absoluto de tus finanzas de una manera sencilla.
                  </Typography>
                  <Typography variant="h3" color="indigo" className="font-normal">
                    Podrás tener el control de gastos diarios; el de tu cuenta personal, generar reportes y más.
                  </Typography>
                  <Typography variant="h3" color="indigo" className="font-normal">
                    Lo único que debes hacer es crear una cuenta o iniciar sesión
                  </Typography>
                  <Link href="/user">
                    <Button size="lg" color="blue">Comienza aquí</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </section>
        </main>
      </div>
    </>

  );
}
