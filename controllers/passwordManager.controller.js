import User from "../models/user.model.js";
import { createHash, createCipheriv } from "node:crypto";

const encryptCredentials = async (req, res) => {
  try {
    const application = req.body.application;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.email;
    const colorCode = req.colorCode.replace("#", "");

    const key = createHash("sha3-256")
      .update(application)
      .digest("hex")
      .substr(0, 32);

    const usernameCipher = createCipheriv("aes-256-gcm", key, colorCode);

    const encryptedUsername =
      usernameCipher.update(username, "utf8", "hex") +
      usernameCipher.final("hex");

    const usernameAuthTag = usernameCipher.getAuthTag();

    const passwordCipher = createCipheriv("aes-256-gcm", key, colorCode);

    const encryptedPassword =
      passwordCipher.update(password, "utf8", "hex") +
      passwordCipher.final("hex");

    const passwordAuthTag = passwordCipher.getAuthTag();

    const user = await User.findOne({
      email: email,
    });

    user.credentials.push({
      [application]: {
        username: encryptedUsername,
        usernameAuthTag: usernameAuthTag,
        password: encryptedPassword,
        passwordAuthTag: passwordAuthTag,
      },
    });

    const updatedUser = await user.save();

    if (updatedUser) res.send("Credentials encrypted");
    else res.send("Credentials not encrypted");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const passwordManagerController = {
  encryptCredentials,
};

export default passwordManagerController;
