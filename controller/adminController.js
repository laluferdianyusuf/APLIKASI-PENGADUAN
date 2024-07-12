const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { admin } = require("../models");
const { JWT } = require("../lib/const");
const { pengaduan } = require("../models");

module.exports = {
  async registerAdmin(req, res) {
    const { password } = req.body;
    const admins = await admin.create({
      name: req.body.name,
      username: req.body.username,
      phoneNumber: req.body.phoneNumber,
      password: await bcrypt.hash(password, JWT.SALT_ROUND),
    });
    res.status(201).json({
      status: "Ok",
      message: "Succesfully Register Admin",
      data: admins,
    });
  },
  async loginAdmin(req, res) {
    try {
      const { username, password } = req.body;
      const admins = await admin.findOne({ where: { username } });
      console.log("username :", username);
      if (!admins) {
        console.log("Email Tak Sama");
        res.status(404).json({
          message: "Can't find that account",
        });
      }
      const isPasswordCorrect = bcrypt.compareSync(password, admins.password);
      console.log(isPasswordCorrect);

      if (!isPasswordCorrect) {
        console.log("Password Tak Sama ");
        req.json({
          message: "Can't find that Account",
        });
        return;
      }
      const token = jwt.sign(
        {
          id: admin.id,
          name: admin.name,
        },
        JWT.SECRET
      );
      console.log("Generate Token ", token);
      return res.status(200).json({
        message: "Berhasil Login",
        data: token,
      });
    } catch (error) {
      console.log(error);
    }
  },
  async complaintUpdate(req, res) {
    try {
      const { id } = req.params;
      const getPengaduan = await pengaduan.findByPk(id);
      console.log("getPengaduan: ", getPengaduan);

      if (!getPengaduan) {
        return res.status(400).json({
          status: false,
          message: "complaint not found",
        });
      }
      const updatePengaduan = await getPengaduan.update({
        status: "Sedang diproses",
      });
      res.status(200).json({
        status: true,
        message: "Complaint status updated to 'sedang diproses'",
        data: updatePengaduan,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Failed to update complaint status",
      });
    }
  },
  async complaintDone(req, res) {
    try {
      const { id } = req.params;
      const getPengaduan = await pengaduan.findByPk(id);
      if (!getPengaduan) {
        return res.status(400).json({
          status: false,
          message: "Complaint not found",
        });
      }
      const pengaduanDone = await getPengaduan.update({
        status: "Kasus Telah Selesai",
      });
      res.status(200).json({
        status: true,
        message: "Complaint status updated to 'Kasus Telah Selesai'",
        data: pengaduanDone,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Failed to update complaint status",
      });
    }
  },
  async updateAdmin(req, res) {
    try {
      const token = req.tokenPayload;
      const id = token.id;
      const adminUpdate = await admin.findOne({ where: { id } });
      console.log("adminUpdate: ", adminUpdate);
      const admins = admin.update(
        {
          name: req.body.name ? req.body.name : adminUpdate.name,
          username: req.body.username
            ? req.body.username
            : adminUpdate.username,
          phoneNumber: req.body.phoneNumber
            ? req.body.phoneNumber
            : adminUpdate.phoneNumber,
        },
        { where: { id } }
      );
      res.status(201).json({
        status: "OK",
        message: "Admin Successfully Updated",
        data: admins,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        message: "Admin Not Found",
      });
    }
  },
};
