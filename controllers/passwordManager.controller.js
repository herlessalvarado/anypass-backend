import User from "../models/user.model.js";
import { createHash, createCipheriv, createDecipheriv } from "node:crypto";

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

    console.log(usernameCipher.getAuthTag());

    const usernameAuthTag = usernameCipher.getAuthTag().toString("base64");

    const passwordCipher = createCipheriv("aes-256-gcm", key, colorCode);

    const encryptedPassword =
      passwordCipher.update(password, "utf8", "hex") +
      passwordCipher.final("hex");

    const passwordAuthTag = passwordCipher.getAuthTag().toString("base64");

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

const decryptCredentials = async (req, res) => {
  try {
    const index = req.body.index;
    const application = req.body.application;
    const email = req.email;
    const colorCode = req.colorCode.replace("#", "");

    const user = await User.findOne({
      email: email,
    });

    const requestedCredentials = user.credentials[index][application];

    if (requestedCredentials) {
      const key = createHash("sha3-256")
        .update(application)
        .digest("hex")
        .substr(0, 32);

      const usernameDecipher = createDecipheriv("aes-256-gcm", key, colorCode);

      usernameDecipher.setAuthTag(
        Buffer.from(requestedCredentials.usernameAuthTag, "base64")
      );

      const decryptedUsername =
        usernameDecipher.update(requestedCredentials.username, "hex", "utf-8") +
        usernameDecipher.final("utf8");

      const passwordDecipher = createDecipheriv("aes-256-gcm", key, colorCode);

      passwordDecipher.setAuthTag(
        Buffer.from(requestedCredentials.passwordAuthTag, "base64")
      );

      const decryptedPassword =
        passwordDecipher.update(requestedCredentials.password, "hex", "utf-8") +
        passwordDecipher.final("utf8");

      res.send({
        username: decryptedUsername,
        password: decryptedPassword,
      });
    } else {
      res.send("Could not find requested credentials");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const passwordManagerController = {
  encryptCredentials,
  decryptCredentials,
};

export default passwordManagerController;
