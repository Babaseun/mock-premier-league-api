import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ITokenAttributes } from "../contracts";
import dotenv from "dotenv";
dotenv.config();

const Helper = {
	generateToken(tokenAttributes: ITokenAttributes): string {
		return jwt.sign({ tokenAttributes }, process.env.SECRET!, {
			expiresIn: "1d",
		});
	},
	hashPassword(password: string): string {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
	},
	comparePassword(password: string, hashPassword: string): boolean {
		return bcrypt.compareSync(password, hashPassword);
	},
};

export default Helper;