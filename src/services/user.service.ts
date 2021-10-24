import { IResponse, ITokenAttributes, IUserAttributes } from "../contracts";
import Helper from "../Helpers/Helper";
import { User } from "../models/user";
import { StatusCodes } from "http-status-codes";

class UserService {
	async createUser(user: IUserAttributes): Promise<IResponse> {
		try {
			const hash = Helper.hashPassword(user.password);
			const userModel = new User({ ...user, password: hash });
			
			const { _id, isAdmin, email } = await userModel.save();
			
			const tokenAttributes: ITokenAttributes = {
				_id,
				isAdmin,
				email,
			};
			const token = Helper.generateToken(tokenAttributes);
			return {
				statusCode: StatusCodes.CREATED,
				token,
			};
		} catch (e: any) {
			console.log(`An Error occurred while saving new user ${e}`);
			if (e.keyValue.email) {
				return {
					statusCode: StatusCodes.BAD_REQUEST,
					message: `User with email ${user.email} already exists`,
				};
			}
			
			return {
				statusCode: StatusCodes.BAD_REQUEST,
				message: `An Error occurred while saving new user ${e}`,
			};
		}
	}
	
	async loginUser({ email }: IUserAttributes) {
		const user = await User.findOne({ email }).exec();
		const tokenAttributes: ITokenAttributes = {
			_id: user!._id,
			isAdmin: user!.isAdmin,
			email: user!.email,
		};
		const token = Helper.generateToken(tokenAttributes);
		return { token };
	}
}

export default UserService;
