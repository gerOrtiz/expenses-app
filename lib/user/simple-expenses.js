'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDB } from "../db";

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

export async function getActiveTable() {
  const { session, client, db, collection } = await setInitialValues();

  try {
    const existingTable = await collection.findOne({ user_id: session.user.email, status: 'active' });
    if (!existingTable) { client.close(); return { error: 'No hay ninguna tabla de gastos activa' }; }
    const simpleData = { ...existingTable };
    delete simpleData._id;
    return simpleData;


  } catch (error) {
    client.close();
    throw new Error('Could not connect to database');
    //return { error: 'Could not connect to database' };
  }

}

export async function createNewTable(initialValues) {
  const { session, client, collection } = await setInitialValues();
  const initialTableValues = {
    user_id: session.user.email,
    status: 'active',
    income: { ...initialValues },
    sDate: new Date().getTime()
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