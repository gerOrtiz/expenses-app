import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://gersonortiz:AH8Bi78pwXSF5GJ5@cluster0.5ylxpxm.mongodb.net/expenses?retryWrites=true&w=majority&appName=Cluster0'


export async function connectToDB() {
  const client = await MongoClient.connect(uri);
  return client;
}