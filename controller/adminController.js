const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { JWT, ROLES } = require("../lib/const");
const { pengaduan } = require("../models");

module.exports = {
  async registerAdmin(req, res) {
    const { password } = req.body;
    const admins = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      password: await bcrypt.hash(password, JWT.SALT_ROUND),
      role: ROLES.ADMIN,
    });
    return res.status(200).json({
      status: true,
      message: "Berhasil melakukan registrasi admin",
      data: { admins: admins },
    });
  },
  async loginAdmin(req, res) {
    try {
      const { username, password } = req.body;
      const admins = await User.findOne({ where: { username } });
      console.log("username :", username);
      if (!admins) {
        console.log("Belum melakukan registrasi");
        res.status(404).json({
          status: false,
          message: "Akun tidak ditemukan",
          data: { admins: null },
        });
        return;
      }
      const isPasswordCorrect = bcrypt.compareSync(password, admins.password);
      console.log(isPasswordCorrect);

      if (!isPasswordCorrect) {
        console.log("Password Tak Sama ");
        res.status(402).json({
          status: false,
          message: "Akun tidak ditemukan",
          data: { admins: null },
        });
        return;
      } else {
        const token = jwt.sign(
          {
            id: admins.id,
            name: admins.name,
            username: admins.username,
          },
          JWT.SECRET
        );
        console.log("Generate Token ", token);
        return res.status(200).json({
          status: true,
          message: "Berhasil Login",
          data: { token },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Terjadi kesalah pada server",
        data: { admins: null },
      });
    }
  },
  async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const getAdmin = await User.findByPk(id);
      console.log("Admin Sekarang: ", getAdmin);
      if (!getAdmin) {
        return res.status(404).json({
          status: false,
          message: "Gagal melakukan update",
          data: { admins: null },
        });
      }
      const { name, username, email, address, phoneNumber } = req.body;
      const updateAdmin = getAdmin.update({
        name,
        username,
        email,
        address,
        phoneNumber,
      });
      console.log("Admin Terbaru: ", updateAdmin);
      return res.status(200).json({
        status: true,
        message: "Admin berhasil di perbarui",
        data: { admins: updateAdmin },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Admin tidak di temukan",
        data: { admins: null },
      });
    }
  },
  async complaintUpdate(req, res) {
    try {
      const { id } = req.params;
      const getPengaduan = await pengaduan.findByPk(id);
      console.log("getPengaduan: ", getPengaduan);

      if (!getPengaduan) {
        return res.status(401).json({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { admins: null },
        });
      }
      const updatePengaduan = await getPengaduan.update({
        status: "Sedang diproses",
      });
      return res.status(200).json({
        status: true,
        message: "Status pengaduan diperbarui ke 'sedang diproses'",
        data: { admins: updatePengaduan },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: false,
        message: "Gagal memperbarui status pengaduan",
        data: { admins: null },
      });
    }
  },
  async complaintDone(req, res) {
    try {
      const { id } = req.params;
      const getPengaduan = await pengaduan.findByPk(id);
      if (!getPengaduan) {
        return res.status(401).json({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { admins: null },
        });
      }
      const pengaduanDone = await getPengaduan.update({
        status: "Kasus Telah Selesai",
      });
      return res.status(200).json({
        status: true,
        message: "Status pengaduan diperbarui ke 'Kasus Telah Selesai'",
        data: { admins: pengaduanDone },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Gagal melakukan pembaruan status pengaduan",
        data: { admins: null },
      });
    }
  },
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
