const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { JWT, ROLES } = require("../lib/const");
const { pengaduan } = require("../models");

module.exports = {
  async getByEmail(req, res) {
    const getUser = await User.findOne({ where: { email: email } });
    if (!getUser) {
      res.status(401).json({
        status: false,
        message: "Cannot get Users",
      });
    }
    return getUser;
  },
};
