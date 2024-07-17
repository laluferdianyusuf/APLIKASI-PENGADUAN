const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT, ROLES } = require("../lib/const");
const adminController = require("../controller/adminController");
const { admin } = require("../models");
const { User } = require("../models");
const userController = require("../controller/userController");
const { where } = require("sequelize");

module.exports = {
  async authenticate(req, res, next) {
    const authHeader = req.get("Authorization");
    let token = " ";
    if (authHeader && authHeader.startsWith("Bearer"))
      token = authHeader.split(" ")[1];
    else
      return res.status(401).send({
        status: false,
        message: "You have to login to access this resource",
        data: null,
      });
    try {
      const { username } = jwt.verify(token, JWT.SECRET);
      console.log("username: ", username);
      const getUser = await User.findOne({ where: { username: username } });
      if (!getUser) {
        return res.status(401).json({
          status: false,
          message: "Invalid token: User not found",
          data: null,
        });
      }
      req.user = getUser;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).send({
        status: false,
        message: "Your Session has expired" + error,
        data: null,
      });
    }
    const isSuperAdmin = async (req, res, next) => {
      const admins = req.admin; // asumsikan bahwa pengguna telah diautentikasi dan objek pengguna telah disimpan di req.user

      if (admins && admins.role === ROLES.SUPERADMIN) {
        return next();
      }
      return res.status(401).json({
        status: false,
        message: "You must be superadmin to access this resource",
        data: null,
      });
    };
    const roles = async (req, res, next) => {
      const admins = req.admin;

      if (admins.role === ROLES.SUPERADMIN || admins.role === ROLES.ADMIN)
        return next();
      return res.status(401).send({
        status: false,
        message: "Your account doesn't have permissions",
        data: null,
      });
    };
  },
};
