'use server';

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { setData } from "@/services/reports.service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDB } from "../db";

async function setInitialValues() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/user');
  let client;
  try {
    client = await connectToDB();
    const db = client.db();
    return { session, client, db };
  } catch (error) {
    throw new Error('Error: Could not connect to DB');
  }
}

export async function getData(reportType, dateFilter) {
  const { session, client, db } = await setInitialValues();
  let collection = db.collection('account_movements');
  if (reportType == 1) collection = db.collection('simple-expenses');
  try {
    const query = { user_id: session.user.email, fDate: { $gte: dateFilter.sDate, $lte: dateFilter.fDate } };
    const response = await collection.find(query).toArray();
    // if (response.length > 0) setData(response);
    client.close();
    return response.length > 0 ? setData(response) : [];
  } catch (error) {
    console.error(error);
    if (client) client.close();
    throw new Error('Something went wrong with the database, please try again');
  }

}

