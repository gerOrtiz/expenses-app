import { MongoClient, Db, ObjectId } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@expensescluster.ntschpt.mongodb.net/?retryWrites=true&w=majority&appName=ExpensesCluster`;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDB(): Promise<{ client: MongoClient, db: Db }> {
	if (cachedClient && cachedDb) {
		return { client: cachedClient, db: cachedDb };
	}
	try {
		const client = await MongoClient.connect(uri);
		const db = client.db('expensesApp');
		// cachedClient = client;
		// cachedDb = db;

		return { client, db };
	} catch (error) {
		console.error('Could not connect to Mongo: ');
		throw new Error(error);
	}

}

export async function disconnectFromDB(): Promise<void> {
	if (cachedClient) {
		await cachedClient.close();
		cachedClient = null;
		cachedDb = null;
	}
}

export function convertToObjectId(string) {
	const newObject = new ObjectId(string);
	return newObject;
}
