


import TableWrapper from "@/components/dashboard/tables/simpleTableWrapper";
import TableView from "@/components/dashboard/tables/createNewTable";
import TSpinner from "@/components/ui/spinner";
import { createNewTable, getActiveTable } from "@/lib/user/simple-expenses";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function createTable(rawFormData) {
  'use server';
  const response = await createNewTable(rawFormData);
  if (!response.error) redirect('/dashboard/simple-table');
}


export default function SimpleExpensesTable() {

  async function TablePage() {
    const currentTable = await getActiveTable();
    if (!currentTable.error) return <TableWrapper data={currentTable} />
    return <TableView submitHandler={createTable} />
  }
  return (<>
    <div className="flex min-h-screen flex-col py-2">
      <main className="relative flex-1 lg:container text-center p-0 mx-auto overflow-x-hidden overflow-auto">
        <section>
          <p>Header here</p>
        </section>
        <section>

          <Suspense fallback={<div className="flex flex-col"><TSpinner /><p>Fetching data...</p></div>}>
            <TablePage />
          </Suspense>
        </section>
      </main>
    </div>
  </>);
}