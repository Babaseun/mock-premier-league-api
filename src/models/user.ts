import { Schema, model } from 'mongoose';
import { IUserAttributes } from "../contracts";

const userSchema = new Schema<IUserAttributes>({
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String, unique: true },
	password: { type: String },
	isAdmin: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now() },
	updatedAt: { type: Date, default: Date.now() },
});

export const User = model<IUserAttributes>('User', userSchema);