import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
}

declare global {
     
    var mongoose: { conn: unknown; promise: Promise<unknown> | null } | undefined;
}

if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}
const cached = global.mongoose as { conn: unknown; promise: Promise<unknown> | null };

export async function connectToDatabase() {
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        const opts = {
            bufferCommands: true,
            maxPoolSize:10
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection)
    }

    try{
        cached.conn = await cached.promise
    }catch(err){
        cached.promise = null;
        throw err;
    }
    return cached.conn
}