import { Response, Request } from "express";
import { matchedData } from "express-validator";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { IUserAttributes } from "../contracts";
import UserService from "../services/user.service";

const userService = new UserService();

const UserController = {
  async Create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) return res.status(422).json(errors.array());

      const payload = matchedData(req) as IUserAttributes;
      const response = await userService.createUser(payload);
      switch (response.statusCode) {
        case StatusCodes.CREATED:
          return res.status(response.statusCode).send({ token: response.token });
        default:
          return res.status(response.statusCode).send({ message: response.message });
      }
    } catch (error) {
      return res.status(400).send({
        message: `Error occurred while processing your request ${error}`,
      });
    }
  },
  async Login(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json(errors.array());

    const payload = matchedData(req) as IUserAttributes;

    const response = await userService.loginUser(payload);

    return res.status(200).send(response);
  },
};

export default UserController;
