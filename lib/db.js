import { MongoClient, ObjectId } from "mongodb";
// import { ObjectId } from 'bson';

//const uri = 'mongodb+srv://gersonortiz:AH8Bi78pwXSF5GJ5@cluster0.5ylxpxm.mongodb.net/expenses?retryWrites=true&w=majority&appName=Cluster0';
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.5ylxpxm.mongodb.net/expenses?retryWrites=true&w=majority&appName=Cluster0`;

export async function connectToDB() {
  const client = await MongoClient.connect(uri);
  return client;
}

export function convertToObjectId(string) {
  const newObject = new ObjectId(string);
  return newObject;
}