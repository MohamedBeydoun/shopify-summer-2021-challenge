import * as jwt from "jsonwebtoken";
import { auth } from "../util/auth";
import { statusCodes } from "../config/statusCodes";

const authMiddleware = {
  introspect: (req, res, next) => {
    try {
      const uri = req.originalUrl;
      const method = req.method;
      const token = req.headers.authorization;

      if (!token) {
        res.status(statusCodes.UNAUTHORIZED).json({
          status: statusCodes.UNAUTHORIZED,
          message: "Unauthorized",
        });
        res.end();
        return;
      }

      const { route, resourceId } = auth.parseUri(decodeURI(uri));
      if (!route) {
        res.status(statusCodes.NOT_FOUND).json({
          status: statusCodes.NOT_FOUND,
          message: "Invalid route",
        });
        res.end();
        return;
      }

      const payload = jwt.verify(token, process.env.SECRET);

      req.params.auth = {
        userIdFromToken: payload["id"],
        idFromRoute: resourceId,
      };

      next();
    } catch (err) {
      console.log(err);
      res.status(statusCodes.UNAUTHORIZED).json({
        status: statusCodes.UNAUTHORIZED,
        message: "Unauthorized",
      });
    }
  },
};

export { authMiddleware };
