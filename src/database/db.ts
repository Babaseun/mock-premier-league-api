import mongoose from "mongoose";

const { DBURI, NODE_ENV } = process.env;

export async function connect() {
	if (NODE_ENV !== "test") {
		
		try {
			await mongoose.connect(DBURI!);
			console.info("DB connected");
		} catch (error) {
			console.error("Could not connect to db. " + error);
			console.error("DBURI: " + DBURI);
			process.exit(1);
		}
	} else {
		
	}
}

export async function close() {
	if (process.env.NODE_ENV !== "test") {
		
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
		// await mongoServer.stop();
	}
	
}

