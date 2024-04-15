
import TableWrapper from "@/components/dashboard/tables/simpleTableWrapper";
import TableView from "@/components/dashboard/tables/createNewTable";
import TSpinner from "@/components/ui/spinner";
import DashboardHeader from "@/components/dashboard/header";
import { createNewTable, getActiveTable } from "@/lib/user/simple-expenses";
import { redirect } from "next/navigation";
import { Suspense, } from "react";

let currentTable;

async function createTable(rawFormData) {
  'use server';
  const response = await createNewTable(rawFormData);
  if (!response.error) redirect('/dashboard/simple-table');
}

async function TablePage() {
  currentTable = await getActiveTable();

  const tableWrapper = (<>
    <DashboardHeader hasCurrentData={true} />
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        <section>
          <TableWrapper data={currentTable} />
        </section>
      </div>
    </main>
  </>);

  const createTableView = (<>
    <DashboardHeader hasCurrentData={false} />
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        <section>
          <TableView submitHandler={createTable} />
        </section>
      </div>
    </main>
  </>);

  if (!currentTable.error) { return tableWrapper; }
  return createTableView;
}

export default function SimpleExpensesTable() {

  const wrapper = (
    <main className="flex min-h-max flex-col py-2">
      <div className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        <section>
          <div className="flex flex-col"><TSpinner /><p>Fetching data...</p></div>
        </section>
      </div>
    </main>
  );

  return (<>
    <Suspense fallback={wrapper}>
      <TablePage />
    </Suspense>
  </>);
}