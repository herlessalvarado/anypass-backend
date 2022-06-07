import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { pbkdf2Sync } from "node:crypto";

const signup = async (req, res) => {
  try {
    const email = req.body.email;
    const masterPassword = req.body.masterPassword;
    const colorCode = req.body.colorCode;

    const firstPasswordHash = pbkdf2Sync(
      masterPassword,
      email + masterPassword + colorCode,
      100000,
      16,
      "sha3-512"
    ).toString("hex");

    const secondPasswordHash = pbkdf2Sync(
      firstPasswordHash,
      colorCode,
      100000,
      64,
      "sha3-512"
    ).toString("hex");

    const user = await User.create({
      email: email,
      hashedPassword: secondPasswordHash,
    });

    if (user) res.send({ message: "User registered successfully!" });
    else res.send({ message: "User not registered" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const email = req.body.email;
    const masterPassword = req.body.masterPassword;
    const colorCode = req.body.colorCode;

    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const firstPasswordHash = pbkdf2Sync(
      masterPassword,
      email + masterPassword + colorCode,
      100000,
      16,
      "sha3-512"
    ).toString("hex");

    const secondPasswordHash = pbkdf2Sync(
      firstPasswordHash,
      colorCode,
      100000,
      64,
      "sha3-512"
    ).toString("hex");

    const passwordIsValid = secondPasswordHash === user.hashedPassword;
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    return res.status(200).send({
      id: user.id,
      email: user.email,
      token: token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const authController = {
  signup,
  signin,
};

export default authController;
