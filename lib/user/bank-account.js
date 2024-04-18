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
    const collection = db.collection('account-categories');
    return { session, client, db, collection };
  } catch (error) {
    throw new Error('Error: Could not connect to DB');
  }
}

export async function createCategories(categoryList) {
  const { session, client, collection } = await setInitialValues();
  const categoriesObj = {
    user_id: session.user.email,
    categories: categoryList
  };
  try {
    const result = await collection.insertOne(categoriesObj);
    console.log(result);
    client.close();
    revalidatePath
    revalidatePath('/dashboard/bank-account');
    return { message: 'Guardado con éxito' };
  } catch (error) {
    //return { error: 'Something went wrong, please try again' };
    throw new Error('Something went wrong, please try again');
  }

}