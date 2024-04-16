'use server';

import { MongoClient } from "mongodb";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { hashPassword } from "../auth/password";

async function connectToDatabase() {
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.5ylxpxm.mongodb.net/expenses?retryWrites=true&w=majority&appName=Cluster0`;
  let client;
  try {
    client = await MongoClient.connect(uri);
    const db = client.db();
    const collection = db.collection('users');
    return { client, collection };
  } catch (error) {
    throw new Error('Error: Could not connect to DB');
  }
}

export async function signUpUser(prevState, formData) {
  let user = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password')
  };
  if (!user.email.includes('@') ||
    user.name.trim() === '' ||
    user.password.trim() == '' || user.password.length <= 6)
    return { message: 'Invalid input' };

  const { client, collection } = await connectToDatabase();

  try {
    const existingUser = await collection.findOne({ email: user.email });
    if (existingUser) return { message: 'Error: User already exists!' };
  } catch (error) {
    client.close();
    throw new Error('Error: Could not connect to DB');
  }
  const plainPassword = user.password;
  user.password = await hashPassword(user.password);
  try {
    await collection.insertOne(user);
    client.close();
    // login(user);
    const userInfo = { email: user.email, password: plainPassword };
    return { message: 'User saved!', user: userInfo };
  } catch (error) {
    client.close();
    throw new Error('Error: Could not save user, please try again later');
  }
}

function login(user) {
  setTimeout(async () => {
    const result = await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: user.password
    });
    console.log(result);
    if (!result.error) return redirect('/dashboard');
  }, 1000);
}
