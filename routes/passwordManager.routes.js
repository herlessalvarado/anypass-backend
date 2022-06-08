import { authJwt } from "../middleware/index.js";
import controller from "../controllers/passwordManager.controller.js";

const passwordManagerRoutes = (app) => {
  app.post("/encrypt", [authJwt.verifyToken], controller.encryptCredentials);
};

export default passwordManagerRoutes;
