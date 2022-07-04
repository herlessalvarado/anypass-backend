import { authJwt } from "../middleware/index.js";
import controller from "../controllers/passwordManager.controller.js";

const passwordManagerRoutes = (app) => {
  app.get("/applications", [authJwt.verifyToken], controller.getApplications);
  app.post("/encrypt", [authJwt.verifyToken], controller.encryptCredentials);
  app.post("/decrypt", [authJwt.verifyToken], controller.decryptCredentials);
};

export default passwordManagerRoutes;
