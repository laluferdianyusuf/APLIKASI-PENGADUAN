const nodeMailer = require("nodemailer");
const { pengaduan } = require("../models");
const { User } = require("../models");
const { ROLES } = require("../lib/const");
const { Op } = require("sequelize");
module.exports = {
  async complaintClient(req, res) {
    try {
      const user_id = req.user.id;
      const sendComplaint = await User.findAll({
        where: {
          [Op.or]: [{ role: ROLES.ADMIN }, { role: ROLES.SUPERADMIN }],
        },
      });
      const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: "appcom2024@gmail.com",
          pass: "nkex bofk zujl ajwy",
        },
      });

      const {
        name,
        born,
        gender,
        nik,
        address,
        phoneNumber,
        education,
        parentName,
        parentJob,
        parentAddress,
        parentNumber,
        caseType,
        caseViolence,
        physical,
        sexual,
        psychology,
        economy,
        chronology,
      } = req.body;
      if (caseViolence == "fisik" && !physical) {
        return res.status(200).json({
          status: true,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "sexual" && !sexual) {
        return res.status(200).json({
          status: true,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "psikologi" && !psychology) {
        return res.status(200).json({
          status: true,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "ekonomi" && !economy) {
        return res.status(200).json({
          status: true,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      const emailAddresses = sendComplaint.map((user) => user.email);
      const mailOption = {
        from: "appcom2024@gmail.com",
        to: emailAddresses,
        subject: "Laporan Pengaduan dari Mitra",
        html:
          '<p>Silahkan lihat lengkap laporan pengaduan <a href="https://play.google.com/store/apps/details?id=com.tokopedia.tkpd' +
          '">link</a> Masuk ke aplikasi</p>',
      };
      const createPengaduan = await pengaduan.create({
        userid: user_id,
        name,
        born,
        gender,
        nik,
        address,
        phoneNumber,
        education,
        parentName,
        parentJob,
        parentAddress,
        parentNumber,
        caseType,
        caseViolence,
        physical,
        sexual,
        psychology,
        economy,
        chronology,
        status: "Menunggu konfirmasi",
      });
      if (createPengaduan) {
        await transporter.sendMail(mailOption);
        return res.status(200).json({
          status: true,
          message: "Berhasil Membuat Pengaduan",
          data: { complaint: createPengaduan },
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Gagal Membuat Pengaduan",
        data: { complaint: null },
      });
    }
  },

  async updatePengaduan(req, res) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const getPengaduanById = await pengaduan.findByPk(id);
      if (!getPengaduanById) {
        return res.status(400).json({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { complaint: null },
        });
      }

      const {
        name,
        born,
        gender,
        nik,
        address,
        phoneNumber,
        education,
        parentName,
        parentJob,
        parentAddress,
        parentNumber,
        caseType,
        caseViolence,
        physical,
        sexual,
        psychology,
        economy,
        chronology,
      } = req.body;
      if (caseViolence === "fisik" && !physical) {
        return res.status(401).json({
          status: false,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "sexual" && !sexual) {
        return res.status(402).json({
          status: false,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "psikologi" && !psychology) {
        return res.status(403).json({
          status: false,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }
      if (caseViolence == "ekonomi" && !economy) {
        return res.status(404).json({
          status: false,
          message: "Harus diisi",
          data: { complaint: null },
        });
      }

      const updatePengaduan = await getPengaduanById.update({
        userid: user_id,
        name,
        born,
        gender,
        nik,
        address,
        phoneNumber,
        education,
        parentName,
        parentJob,
        parentAddress,
        parentNumber,
        caseType,
        caseViolence,
        physical,
        sexual,
        psychology,
        economy,
        chronology,
        status: "Menunggu Konfirmasi",
      });

      return res.status(200).json({
        status: true,
        message: "Update Sukses",
        data: { complaint: updatePengaduan },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Gagal Update Pengaduan",
        data: { complaint: null },
      });
    }
  },
  async deletePengaduan(req, res) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const result = await pengaduan.destroy({
        where: { id, userid: user_id },
      });
      if (!result) {
        return res.status(404).json({
          deletedby: req.result,
          message: "Pengaudan Tidak ditemukan",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Berhasil Menghapus Pengaduan",
        data: { complaint: result },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async listComplaint(req, res) {
    try {
      const getComplaint = await pengaduan.findAll();
      if (getComplaint) {
        return res.status(200).json({
          status: true,
          massage: "List Pengaduan",
          data: { complaint: getComplaint },
        });
      } else {
        return res.status(401).json({
          status: false,
          massage: "List Pengaduan Tidak ditemukan",
          data: { complaint: null },
        });
      }
    } catch (error) {
      return res.json(500).json({
        status: false,
        massage: "Terjadi Kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async getCaseViolence(req, res) {
    try {
      const getComplaint = await pengaduan.findAll({});

      let violenceCount = {
        physical: 0,
        sexual: 0,
        psychology: 0,
        economy: 0,
      };

      getComplaint.forEach((complaint) => {
        switch (complaint.caseViolence) {
          case "physical":
            violenceCount.physical++;
            break;
          case "sexual":
            violenceCount.sexual++;
            break;
          case "psychology":
            violenceCount.psychology++;
            break;
          case "economy":
            violenceCount.economy++;
            break;
          default:
            break;
        }
      });
      if (getComplaint && getComplaint.length > 0) {
        return res.status(200).json({
          status: true,
          massage: "List Pengaduan berdasarkan jenis kekerasan",
          data: { complaint: violenceCount },
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        massage: "Terjadi Kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async getGender(req, res) {
    try {
      const getComplaint = await pengaduan.findAll({});
      let genderCount = { male: 0, female: 0 };

      getComplaint.forEach((complaint) => {
        switch (complaint.gender.toLowerCase()) {
          case "laki - laki":
          case "laki-laki": // Ensure consistent handling of possible variations
            genderCount.male++;
            break;
          case "perempuan":
            genderCount.female++;
            break;
          default:
            break;
        }
      });

      if (getComplaint.length > 0) {
        return res.status(200).json({
          status: true,
          message: "List Pengaduan berdasarkan jenis kelamin",
          data: { complaint: genderCount },
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },
  async getCaseByEducation(req, res) {
    try {
      const getComplaint = await pengaduan.findAll({});

      let complaintCounts = {
        TK: 0,
        SD: 0,
        SMP: 0,
        SMA: 0,
        PerguruanTinggi: 0,
      };

      getComplaint.forEach((complaint) => {
        switch (complaint.education) {
          case "TK":
            complaintCounts.TK++;
            break;
          case "SD":
            complaintCounts.SD++;
            break;
          case "SMP":
            complaintCounts.SMP++;
            break;
          case "SMA":
            complaintCounts.SMA++;
            break;
          case "Perguruan Tinggi":
            complaintCounts.PerguruanTinggi++;
            break;
          default:
            break;
        }
      });

      if (getComplaint.length > 0) {
        return res.status(200).json({
          status: true,
          message: "List Pengaduan berdasarkan jenjang pendidikan",
          data: { complaint: complaintCounts },
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },

  async getWaitComplaintByUserId(req, res) {
    try {
      const userId = req.user.id;
      const status = "Menunggu Konfirmasi";
      const role = req.user.role;

      let results;

      if (role === "Admin" || role === "superadmin") {
        results = await pengaduan.findAll({ where: { status: status } });
      } else {
        results = await pengaduan.findAll({
          where: { status: status, userId: userId },
        });
      }

      if (!results) {
        return res.status(404).json({
          status: false,
          message: "Kasus tidak ditemukan",
          data: { complaint: null },
        });
      }
      if (results) {
        return res.status(200).json({
          status: true,
          message: "Berhasil mendapatkan pengaduan",
          data: { complaint: results },
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async getProccessComplaintByUserId(req, res) {
    try {
      const userId = req.user.id;
      const status = "Sedang diproses";
      const role = req.user.role;

      let results;

      if (role === "Admin" || role === "superadmin") {
        results = await pengaduan.findAll({ where: { status: status } });
      } else {
        results = await pengaduan.findAll({
          where: { status: status, userId: userId },
        });
      }

      if (!results) {
        return res.status(404).json({
          status: false,
          message: "Kasus tidak ditemukan",
          data: { complaint: null },
        });
      }
      if (results) {
        return res.status(200).json({
          status: true,
          message: "Berhasil mendapatkan pengaduan",
          data: { complaint: results },
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async getDoneComplaintByUserId(req, res) {
    try {
      const userId = req.user.id;
      const status = "Kasus Telah Selesai";
      const role = req.user.role;

      let results;

      if (role === "Admin" || role === "superadmin") {
        results = await pengaduan.findAll({ where: { status: status } });
      } else {
        results = await pengaduan.findAll({
          where: { status: status, userId: userId },
        });
      }

      if (!results) {
        return res.status(404).json({
          status: false,
          message: "Kasus tidak ditemukan",
          data: { complaint: null },
        });
      }
      if (results) {
        return res.status(200).json({
          status: true,
          message: "Berhasil mendapatkan pengaduan",
          data: { complaint: results },
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },

  async getComplaintbyId(req, res) {
    try {
      const { id } = req.params;
      const getCase = await pengaduan.findByPk(id);
      if (!getCase) {
        return res.status(401).json({
          status: false,
          message: "Kasus tidak dapat ditemukan",
          data: { complaint: null },
        });
      }
      return res.status(200).json({
        status: true,
        message: "List Pengaduan berdasarkan id",
        data: { complaint: getCase },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async getComplaintUpdate(req, res) {
    try {
      const status = "Sedang diproses";
      const getComplaint = await pengaduan.findOne({ where: { status } });

      if (!getComplaint) {
        return res.status(401).json({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { complaint: getComplaint },
        });
      }
      return res.status(200).json({
        status: true,
        message: "List Pengaduan",
        data: { complaint: getComplaint },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { user: null },
      });
    }
  },
  async getComplaintDone(req, res) {
    try {
      const status = "Kasus Telah Selesai";
      const getComplaint = await pengaduan.findOne({ where: { status } });

      if (!getComplaint) {
        return res.status(401).json({
          status: false,
          message: "Pengaduan tidak ditemukan",
          data: { complaint: getComplaint },
        });
      }
      return res.status(200).json({
        status: true,
        message: "List Pengaduan",
        data: { complaint: getComplaint },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { user: null },
      });
    }
  },
};
