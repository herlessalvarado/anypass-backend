import { verifySignUp } from "../middleware/index.js";
import controller from "../controllers/auth.controller.js";

const authRoutes = (app) => {
  app.post("/signup", [verifySignUp.checkDuplicateEmail], controller.signup);
  app.post("/signin", controller.signin);
};

export default authRoutes;
