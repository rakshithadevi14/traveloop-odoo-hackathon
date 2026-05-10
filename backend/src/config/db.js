import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    if (error.message?.includes("tlsv1 alert internal error")) {
      console.error(
        "Atlas TLS handshake failed. Use the MongoDB Atlas SRV connection string (mongodb+srv://...) from Atlas > Connect > Drivers, and ensure your current IP is allowed in Atlas Network Access.",
      );
    }
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

export default connectDB;
