'use client';
import {
  Button,
  Card,
  CardBody,
  Typography
} from "@material-tailwind/react";
import RemainingIncome from "./remaining-income";
import SimpleTable from "./simple-table";

export default function TableWrapper(props) {
  const { data } = props;
  const { income } = data;

  return (<>
    <main className="mb-12 grid gap-y-10 gap-x-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <section className="relative flex flex-col overflow-hidden xl:col-span-2">
        {data.expenses && <SimpleTable data={data.expenses} />}
        {!data.expenses && (
          <section>
            <Card>
              <CardBody>
                <Typography variant="h6" color="blue-gray" className="mb-2">Aún no hay gastos agregados</Typography>
                <Button>Agregar gasto</Button>
              </CardBody>
            </Card>
          </section>
        )}
      </section>
      <RemainingIncome income={income} />
    </main>
  </>);
}