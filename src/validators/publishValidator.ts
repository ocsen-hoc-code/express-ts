import { body } from "express-validator";

export const validatePublish = [
  body("message").isObject().withMessage("Message must be an object"),
  body("message.id")
    .isString()
    .notEmpty()
    .withMessage("Message ID is required"),
  body("message.content")
    .isString()
    .notEmpty()
    .withMessage("Message content is required"),
];


export const validateUserCreate = [
  body("email").isEmail()
  .notEmpty()
  .withMessage("Email is required"),
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Name is required"),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required"),
];

export const validateUserLogin = [
  body("email").isEmail()
  .notEmpty()
  .withMessage("Email is required"),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required"),
];