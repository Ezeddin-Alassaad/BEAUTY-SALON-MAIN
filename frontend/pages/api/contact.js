import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, service, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.DB_NAME);
    
    const result = await db.collection('contacts').insertOne({
      name,
      email,
      phone: phone || '',
      service: service || '',
      message,
      createdAt: new Date(),
    });

    client.close();
    return res.status(201).json({ message: 'Message stored successfully', result });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Error storing message' });
  }
}