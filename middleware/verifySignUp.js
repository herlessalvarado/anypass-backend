import User from "../models/user.model.js";

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Username!",
    });
  }
};

const verifySignUp = {
  checkDuplicateEmail,
};

export default verifySignUp;
