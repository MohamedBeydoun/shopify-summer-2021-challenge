import { body, param, ValidationChain } from "express-validator/check";

export function imageValidator(method: string): ValidationChain[] {
  switch (method) {
    case "GET /images": {
      return [];
    }
    case "GET /images/:imageId": {
      return [param("imageId", "Invalid ':imageId'").isMongoId()];
    }
    case "POST /images": {
      return [];
    }
    case "DELETE /images/:imageId": {
      return [param("imageId", "Invalid ':imageId'").isMongoId()];
    }
  }
}
