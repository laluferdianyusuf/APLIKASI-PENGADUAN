const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT, ROLES } = require("../lib/const");
const { User } = require("../models");
const { pengaduan } = require("../models");

module.exports = {
  async registerAdmin(req, res) {
    try {
      const { password, email } = req.body;
      if (password.length < 8) {
        return res.status(401).json({
          status: false,
          message: "Password minimal 8 karakter",
          data: { admin: null },
        });
      }
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(402).json({
          status: false,
          message: "Email sudah didaftarkan",
          data: { admin: null },
        });
      }
      const admin = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        password: await bcrypt.hash(password, JWT.SALT_ROUND),
        role: ROLES.ADMIN,
      });
      return res.status(200).json({
        status: true,
        message: "Berhasil melakukan registrasi admin",
        data: { admin: admin },
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { admin: null },
      });
    }
  },
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
  async loginAdmin(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await User.findOne({ where: { username } });
      console.log("username :", username);
      if (!admin) {
        console.log("Belum melakukan registrasi");
        res.status(404).json({
          status: false,
          message: "Akun tidak ditemukan",
          data: { admin: null },
        });
        return;
      }
      const isPasswordCorrect = bcrypt.compareSync(password, admin.password);
      console.log(isPasswordCorrect);

      if (!isPasswordCorrect) {
        console.log("Password Tak Sama ");
        res.status(402).json({
          status: false,
          message: "Akun tidak ditemukan",
          data: { admin: null },
        });
        return;
      } else {
        const token = jwt.sign(
          {
            id: admin.id,
            name: admin.name,
            username: admin.username,
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
        data: { admin: null },
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
  async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const getAdmin = await User.findByPk(id);
      console.log("Admin Sekarang: ", getAdmin);

      if (!getAdmin) {
        return res.status(404).json({
          status: false,
          message: "Gagal melakukan update",
          data: { admin: null },
        });
      }
      const { name, username, email, phoneNumber, address } = req.body;
      const updateAdmin = getAdmin.update({
        name,
        username,
        email,
        phoneNumber,
        address,
      });
      console.log("Admin Terbaru: ", updateAdmin);
      return res.status(200).json({
        status: true,
        message: "Admin berhasil di perbarui",
        data: { admin: updateAdmin },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Admin tidak di temukan",
        data: { admin: null },
      });
    }
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
  async adminUpdateComplaint(req, res) {
    try {
      const { id } = req.params;
      const getPengaduan = await pengaduan.findByPk(id);
      console.log("getPengaduan: ", getPengaduan);

      if (!getPengaduan) {
        return res.status(401).json({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { admin: null },
        });
      }
      const updatePengaduan = await getPengaduan.update({
        status: "Sedang diproses",
      });
      return res.status(200).json({
        status: true,
        message: "Status pengaduan diperbarui ke 'sedang diproses'",
        data: { admin: updatePengaduan },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: false,
        message: "Gagal memperbarui status pengaduan",
        data: { admin: null },
      });
    }
  },
  async adminComplaintDone(req, res) {
    try {
      const { id } = req.params;
      const getPengaduan = await pengaduan.findByPk(id);
      if (!getPengaduan) {
        return res.status(401).json({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { admin: null },
        });
      }
      const pengaduanDone = await getPengaduan.update({
        status: "Kasus Telah Selesai",
      });
      return res.status(200).json({
        status: true,
        message: "Status pengaduan diperbarui ke 'Kasus Telah Selesai'",
        data: { admin: pengaduanDone },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Gagal melakukan pembaruan status pengaduan",
        data: { admin: null },
      });
    }
  },
};
