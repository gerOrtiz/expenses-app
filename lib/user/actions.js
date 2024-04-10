'use server';

import { hashPassword } from "../auth/password";
import { connectToDB } from "../db";

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

  let client;
  try {
    client = await connectToDB();
  } catch (error) {
    return { message: 'Could not connect to database' };
  }
  const db = client.db();
  const collection = db.collection('users');

  try {
    const existingUser = await collection.findOne({ email: user.email });
    if (existingUser) return { message: 'Error: User already exists!' };
  } catch (error) {
    client.close();
    return { message: 'Could not connect to database' };
  }

  user.password = await hashPassword(user.password);
  try {
    const result = await db.collection('users').insertOne(user);
    console.log(result);
    client.close();
    return { message: 'User saved!' };
  } catch (error) {
    client.close();
    return { message: 'Error: Could not save user, please try again later' };
  }
}
