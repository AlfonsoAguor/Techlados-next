import mongoose from 'mongoose';

const mongoUri = process.env.NEXT_PUBLIC_MONGO_DB;

if(!mongoUri) {
    throw new Error("MONGO_URI must be defined");
}

export const connectDB = async() => {
    const { connection } = await mongoose.connect(mongoUri);

    if (connection.readyState === 1){
        try {
            console.log("MongoDB connected");
            return Promise.resolve(true);
        } catch (error) {
            console.log("Error");
            return Promise.resolve(false);
        }
    }
}