import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization.split(" ");
  if (bearerHeader.length === 2) {
    const bearer = bearerHeader[0];
    const token = bearerHeader[1];
    if (/^Bearer$/i.test(bearer)) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: "Unauthorized!",
          });
        }
        req.email = decoded.email;
        req.colorCode = decoded.colorCode;
        next();
      });
    }
  } else {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
};

const authJwt = {
  verifyToken,
};

export default authJwt;
