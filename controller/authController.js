const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { admin } = require("../models");
const { User } = require("../models");
const { JWT } = require("../lib/const");
const { where } = require("sequelize");

module.exports = {
  async authorizeAdmin(req, res) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];
      const { id } = jwt.verify(token, JWT.SECRET);
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
  async authorizeUser(req, res, next) {
    try {
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const tokenPayload = jwt.verify(token, JWT.SECRET);
      //   const authHeader = req.headers("Authorization");
      //   console.log(authHeader);
      //   const token = authHeader.split(" ")[1];
      //   const tokenPayload = jwt.verify(token, JWT.SECRET);
      //   console.log("tokenPayload: ", tokenPayload);
      // const id = tokenPayload.id;
      //   const requestUser = await User.findByPk(tokenPayload.id);
      //   console.log(requestUser);
      // const user = await User.findOne({ where: { id } });
      //   if (!requestUser) {
      //     res.status(401).json({
      //       status: false,
      //       message: "Forbiden",
      //     });
      //   }
      //   req.result = {
      //     user: {
      //       name: requestUser.name,
      //     },
      //   };
      //   req.tokenPayload = tokenPayload;

      //   return next();
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: false,
        message: "Unauthorize Access",
      });
    }
  },
  async authorizeSuperAdmin(req, res, next) {
    try {
      const bearerToken = req.header.authorization;
      const token = bearerToken.split("Bearer ")[1];
      const { id } = jwt.verify(token, JWT.SECRET);
      const requestUser = await admin.findByPk(tokenPayload.id);
      const admins = await admin.findOne({ where: { id } });
      if (requestUser.rolo) {
        req.result = {
          admins: {
            name: admins.name,
          },
        };
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: false,
        message: "Unauthorize Access",
      });
    }
  },
};
