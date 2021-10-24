import config from "../config/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongoServer = new MongoMemoryServer();

const dbUri = config.dbUri;

export async function connect() {
	if (config.NODE_ENV !== "test") {
		
		try {
			await mongoose.connect(dbUri);
			console.info("DB connected");
		} catch (error) {
			console.error("Could not connect to db");
			process.exit(1);
		}
	} else {
		const mongo = await MongoMemoryServer.create();
		const uri = mongo.getUri();
		
		await mongoose.connect(uri);
	}
}

export async function close() {
	if (config.NODE_ENV !== "test") {
		
		try {
			await mongoose.disconnect();
			
			console.info("DB disconnected");
		} catch (error) {
			console.error("Could not disconnect from db");
			process.exit(1);
		}
	} else {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
		await mongoServer.stop();
	}
	
}

