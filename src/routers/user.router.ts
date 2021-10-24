import { Router } from "express";
import { userRules } from "../rules/user.rules";
import UserController from "../controllers/user.controller";

export const userRouter = Router();

// Routes
/**
 * @swagger
 * /api/v1/signup:
 *  post:
 *    description: User/Admin signup route
 *    responses:
 *      '200':
 *        description: A successful response
 *        '422':
 *         description for invalid form data
 */
userRouter.post("/signup", userRules["forRegister"], UserController.Create);
// Routes
/**
 * @swagger
 * /api/v1/login:
 *  post:
 *    description: User/Admin login route
 *    responses:
 *      '200':
 *        description: A successful response
 */
userRouter.post("/login", userRules["forLogin"], UserController.Login);




