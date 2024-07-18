const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { admin } = require("../models");
const { JWT, ROLES } = require("../lib/const");
const { pengaduan } = require("../models");
const { User } = require("../models");

module.exports = {
  async registerUser(req, res) {
    try {
      const { password, email } = req.body;
      if (password.length < 8) {
        return res.status(401).json({
          status: false,
          message: "Password minimal 8 karakter",
          data: { user: null },
        });
      }
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(402).json({
          status: false,
          message: "Email sudah didaftarkan",
          data: { user: null },
        });
      }
      const user = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        password: await bcrypt.hash(password, JWT.SALT_ROUND),
        role: ROLES.USER,
      });
      return res.status(200).json({
        status: true,
        message: "Berhasil melakukan registrasi",
        data: { user: user },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Gagal melakukan registrasi",
        data: { user: null },
      });
    }
  },
  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      console.log("username :", username);
      if (!user) {
        console.log("Belum melakukan registrasi");
        res.status(401).json({
          status: false,
          message: "Akun tidak di temukan ",
          data: { user: null },
        });
        return;
      }
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      console.log(isPasswordCorrect);

      if (!isPasswordCorrect) {
        console.log("Password Tak Sama ");
        res.status(402).json({
          status: false,
          message: "Akun tidak di temukan ",
          data: { user: null },
        });
        return;
      }
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          username: user.username,
        },
        JWT.SECRET
      );
      console.log("Generate Token ", token);
      return res.status(200).json({
        status: true,
        message: "Berhasil Login",
        data: { token },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { user: null },
      });
    }
  },
  async currentUser(req, res) {
    const currentUser = req.user;
    return res.status(200).json({
      status: true,
      message: "Mendapatkan User",
      data: { user: currentUser },
    });
  },
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const getUser = await User.findByPk(id);
      console.log("Current User : ", getUser);

      if (!getUser) {
        return res.status(404).json({
          status: false,
          message: "Gagal melakukan update",
          data: { user: null },
        });
      }
      const { name, username, email, phoneNumber, address } = req.body;
      const updateUser = await getUser.update({
        name,
        username,
        email,
        phoneNumber,
        address,
      });
      console.log("Updated User : ", updateUser);
      return res.status(200).json({
        status: true,
        message: "Berhasil melakukan update",
        data: { user: updateUser },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Gagal melakukan update",
        data: { user: null },
      });
    }
  },
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await User.destroy({ where: { id } });
      if (!result) {
        return res.status(404).json({
          status: false,
          message: "User Tidak ditemukan",
          data: { user: null },
        });
      }
      return res.status(200).json({
        status: true,
        message: "Akun berhasil dihapus",
        data: { user: result },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { user: null },
      });
    }
  },
  async listUser(req, res) {
    try {
      const user = await User.findAll();
      return res.status(200).json({
        status: true,
        message: "List user",
        data: { user: user },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Gagal mendapatkan semua user",
        data: { user: null },
      });
    }
  },
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User tidak ditemukan",
          data: { user: null },
        });
      }
      if (user) {
        return res.status(200).json({
          status: true,
          message: "Berhasil mendapatkan user",
          data: { user: user },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { user: null },
      });
    }
  },
};
