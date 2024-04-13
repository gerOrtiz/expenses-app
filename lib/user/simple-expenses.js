'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { setCurrentExpenses, setExpenses, setPending } from "@/services/simple-expenses.service";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDB, convertToObjectId } from "../db";

async function setInitialValues() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/user');
  let client;
  try {
    client = await connectToDB();
    const db = client.db();
    const collection = db.collection('simple-expenses');
    return { session, client, db, collection };
  } catch (error) {
    throw new Error('Error: Could not connect to DB');
  }
}

export async function createNewTable(initialValues) {
  const { session, client, collection } = await setInitialValues();
  const initialTableValues = {
    user_id: session.user.email,
    status: 'active',
    income: { ...initialValues },
    sDate: new Date().getTime(),
    totals: {
      expenses: { cash: 0, card: 0 },
      pending_remain: { cash: 0, card: 0 },
      pending_paid: { cash: 0, card: 0 }
    },
    pending: [],
    expenses: [],
    remaining: { ...initialValues }
  };
  try {
    const result = await collection.insertOne(initialTableValues);
    client.close();
    revalidatePath('/dashboard/simple-table');
    return { message: 'Guardado con éxito' };
  } catch (error) {
    //return { error: 'Something went wrong, please try again' };
    throw new Error('Something went wrong, please try again');
  }
}

export async function getActiveTable() {
  const { session, client, db, collection } = await setInitialValues();
  try {
    const existingTable = await collection.findOne({ user_id: session.user.email, status: 'active' });
    //const existingTable = await collection.findOne({ _id: '6615a33847f87f99b4fb4ac3' });
    if (!existingTable) { client.close(); return { error: 'No hay ninguna tabla de gastos activa' }; }
    let simpleData = { ...existingTable };
    simpleData.id = simpleData._id.toString();
    delete simpleData._id;
    client.close();
    setCurrentExpenses(simpleData);
    return simpleData;
  } catch (error) {
    client.close();
    throw new Error('Could not connect to database');
    //return { error: 'Could not connect to database' };
  }
}

export async function addPendingExpense(currentTable_id, expenseData) {
  const { client, collection } = await setInitialValues();
  const table_id = convertToObjectId(currentTable_id);
  let updatedTable;
  updatedTable = setPending(expenseData);
  const res = await collection.findOneAndUpdate({ _id: table_id }, {
    $set: { pending: expenseData, totals: updatedTable.totals },
    $currentDate: { lastModified: true }
  }, { returnNewDocument: true, returnDocument: "after", projection: { "_id": 0, "pending": 1, "totals": 1, "data": 1, "remaining": 1, "added": 1 } });
  client.close();
  if (!res || !res.pending) throw new Error('Something went wrong, please try again');
  updatedTable.id = currentTable_id;
  return updatedTable;
}

export async function addExpense(currentTable_id, expenseData) {
  const { client, collection } = await setInitialValues();
  const table_id = convertToObjectId(currentTable_id);
  const existingTable = await collection.findOne({ _id: table_id });
  let updatedTable;
  updatedTable = setExpenses(expenseData, existingTable);
  const res = await collection.updateOne({ _id: existingTable._id }, {
    $set: { expenses: expenseData, totals: updatedTable.totals, remaining: updatedTable.remaining, pending: updatedTable.pending },
    $currentDate: { lastModified: true }
  });
  client.close();
  if (!res || res.modifiedCount <= 0) throw new Error('Something went wrong, please try again');
  updatedTable.id = currentTable_id;
  delete updatedTable._id;
  return updatedTable;
}

export async function updateTotals(currentTable) {
  const { client, collection } = await setInitialValues();
  //const currentTable = getCurrentExpenses();
  //const tableId = convertToObjectId(currentTable.id);
  const res = await collection.findOneAndUpdate({ _id: currentTable._id }, {
    $set: { totals: currentTable.totals },
    $currentDate: { lastModified: true }
  });
  client.close();
  console.log(res);
  //if (!res || !res.pending) console.error('Totals could not be updated');
}