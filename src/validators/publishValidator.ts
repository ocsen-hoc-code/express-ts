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
