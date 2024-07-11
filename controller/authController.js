const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { admin } = require("../models");
const { JWT } = require("../lib/const");

module.exports = {
  async authorizeAdmin(req, res) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];
      const tokenPayload = jwt.verify(token, JWT.SECRET);
      const id = tokenPayload;
      const requestAdmin = await admin.findByPk(tokenPayload.id);
      const admins = await admin.findOne({ where: { id } });
      if (requestAdmin) {
        req.result = {
          admin: {
            name: admins.name,
            username: admins,
            username,
            phoneNumber: admins,
            phoneNumber,
          },
        };
        req.tokenPayload = tokenPayload;
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(403).json({
        status: "FAILED",
        message: "Unauthorize Access",
      });
    }
  },
};
