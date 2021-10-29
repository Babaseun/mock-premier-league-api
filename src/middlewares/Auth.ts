import { Response, NextFunction } from "express";
import { User } from "../models/user";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import config from "../config/config";
import { IGetUserAuthInfoRequest, ITokenAttributes } from "../contracts";

const Auth = {
	async verifyToken(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
		const token: string | undefined = req.headers?.authorization?.split(" ")[1];
		if (!token) {
			return res.status(400).send({ message: "Token is not provided" });
		}
		try {
			const decoded = await (<ITokenAttributes>jwt.verify(token, config.SECRET));
			const user = await User.findOne({ where: { id: decoded._id } });
			if (!user)
				return res.status(400).send({ message: "The token you provided is invalid" });
			req.user = decoded;
			next();
		} catch (error) {
			const expired = error as TokenExpiredError;
			if (expired)
			return res.status(400).send({ message:  expired.message });
			
			return res.status(400).send({ message: "Invalid auth token provided", error });
		}
	},
};

export default Auth;