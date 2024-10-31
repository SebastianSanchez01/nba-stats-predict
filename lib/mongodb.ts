import { MongoClient, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Type assertion since we've already checked that it exists
const uri: string = process.env.MONGODB_URI as string;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

// Cache the MongoDB connection in development
// Prevents multiple connections during hot-reloads
let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

export async function connectToDatabase() {
  // Check if we have a cached connection
  if (cachedClient) {
    return cachedClient.db();
  }

  if (!cachedPromise) {
    const client = new MongoClient(uri, options);
    cachedPromise = client.connect()
      .then((client) => {
        cachedClient = client;
        return client;
      })
      .catch((error) => {
        cachedPromise = null;
        throw error;
      });
  }

  try {
    const client = await cachedPromise;
    return client.db();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}