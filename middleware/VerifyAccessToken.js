const tokenModel = require("../models/Token");

async function verifyAccessToken(req, res, next) {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = await tokenModel.findOne({ token: accessToken }).exec();

    if (!token) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = {
      id: token.userId,
      accessToken: accessToken,
    };

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = verifyAccessToken;
