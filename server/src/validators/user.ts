import { body, param, ValidationChain } from "express-validator/check";
import { validUsername, validPassword } from "./userCustom";

export function userValidator(method: string): ValidationChain[] {
  switch (method) {
    case "GET /users": {
      return [];
    }
    case "GET /users/:userId": {
      return [param("userId", "Invalid ':userId'").isMongoId()];
    }
    case "POST /users": {
      return [
        body("username", "Missing 'username'").exists(),
        body(
          "username",
          "'username' must be alphanumeric, and the only allowed characters are '_' '-' '.'",
        )
          .isString()
          .custom(validUsername),
        body("email", "Missing 'email'").exists(),
        body("email", "Invalid 'email'").isEmail(),
        body("password", "Missing 'password'").exists(),
        body(
          "password",
          "'password' must be at least 6 characters long, and cannot contain spaces",
        )
          .isString()
          .custom(validPassword),
      ];
    }
    case "PUT /users/:userId": {
      return [
        param("userId", "Invalid ':userId'").isString(),
        body("username", "Missing 'username'").exists(),
        body(
          "username",
          "'username' must be alphanumeric, and the only allowed characters are '_' '-' '.'",
        )
          .isString()
          .custom(validUsername),
        body("email", "Missing 'email'").exists(),
        body("email", "Invalid 'email'").isEmail(),
        body("password", "Invalid 'password'").optional().isString(),
        body(
          "password",
          "'password' must be at least 6 characters long, and cannot contain spaces",
        ).custom(validPassword),
      ];
    }
    case "DELETE /users/:userId": {
      return [param("userId", "Invalid ':userId'").isMongoId()];
    }
  }
}
