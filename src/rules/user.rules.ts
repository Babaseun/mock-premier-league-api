import { check } from "express-validator";
import { User } from "../models/user";
import { Promise } from "mongoose";
import Helper from "../Helpers/Helper";

export const userRules = {
  forRegister: [
    check("firstName")
      .not()
      .isEmpty()
      .withMessage("firstName field is required"),
    check("lastName").not().isEmpty().withMessage("lastName field is required"),
    check("isAdmin")
      .optional()
      .not()
      .isEmpty()
      .withMessage("lastName field is required"),

    check("email")
      .isEmail()
      .withMessage("Invalid email format"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Minimum length for password is 8"),
    check("confirmPassword")
      .custom(
        (confirmPassword, { req }) => req.body.password === confirmPassword
      )
      .withMessage("Passwords are different"),
  ],
  forLogin: [
    check("email")
      .isEmail()
      .withMessage("Invalid email format")
      .custom((email) =>
        User.find({email:email})
          .exec()
          .then((u) => {
            if (!u)
              return Promise.reject(
                `User with these email ${email} is not registered`
              );
          })
      ),
    check("password").custom((password, { req }) => {
      return User.findOne({ where: { email: req.body.email } }).exec().then((u) => {
        if (!Helper.comparePassword(password, u!.password)) {
          return Promise.reject(`Invalid login credentials`);
        }
      });
    }),
  ],
};
