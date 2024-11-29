const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(400)
        .json({ message: "user not authenticated", success: false });
    }
    const decode = await jwt.verify(token, process.env.SECRETKEY);
    if (!decode) {
      return res.status(400).json({ message: "invalid token", success: false });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = isAuthenticated;
