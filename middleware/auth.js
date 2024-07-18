const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT, ROLES } = require("../lib/const");
const { admin } = require("../models");
const { User } = require("../models");

module.exports = {
  async authenticate(req, res, next) {
    const authHeader = req.get("Authorization");
    let token = " ";
    if (authHeader && authHeader.startsWith("Bearer"))
      token = authHeader.split(" ")[1];
    else
      return res.status(401).send({
        status: false,
        message: "Harus login terlebih dahulu untuk mendapatkan halaman ini",
        data: null,
      });
    try {
      const { username } = jwt.verify(token, JWT.SECRET);
      console.log("username : ", username);
      const getUser = await User.findOne({ where: { username:username } });
      if (!getUser) {
        return res.status(401).json({
          status: false,
          message: "Token tidak valid: Pengguna tidak ditemukan",
          data: null,
        });
      }
      req.user = getUser;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).send({
        status: false,
        message: "sesi telah kadaluarsa" + error,
        data: null,
      });
    }
  },
  async isSuperAdmin(req, res, next) {
    const admins = req.admin; // asumsikan bahwa pengguna telah diautentikasi dan objek pengguna telah disimpan di req.user

    if (admins && admins.role === ROLES.SUPERADMIN) {
      return next();
    }
    return res.status(401).json({
      status: false,
      message: "Harus menjadi superadmin untuk mengakses halaman ini",
      data: null,
    });
  },
  async roles(req, res, next) {
    const admins = req.admin;

    if (admins.role === ROLES.SUPERADMIN || admins.role === ROLES.ADMIN) {
      return next();
    }
    return res.status(401).send({
      status: false,
      message: "Akun ini tidak memiliki izin",
      data: null,
    });
  },
};
