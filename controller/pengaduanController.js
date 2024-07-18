const { where } = require("sequelize");
const { pengaduan } = require("../models");

module.exports = {
  async complaintClient(req, res) {
    try {
      const user_id = req.user.id;
      console.log(user_id);
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
      console.log(caseViolence);
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
      return res.status(200).json({
        status: true,
        message: "Berhasil Membuat Pengaduan",
        data: { complaint: createPengaduan },
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        status: false,
        message: "Gagal Membuat Pengaduan",
        data: { complaint: null },
      });
    }
  },

  async updatePengaduan(req, res) {
    try {
      const user_id = req.user.id;
      console.log(user_id);
      const { id } = req.params;
      const getPengaduanById = await pengaduan.findByPk(id);
      if (!getPengaduanById) {
        return res.status(500).json({
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
      console.error(error);
      return res.status(400).json({
        status: false,
        message: "Gagal Update Pengaduan",
        data: { complaint: null },
      });
    }
  },
  async deletePengaduan(req, res) {
    try {
      const user_id = req.user.id;
      console.log(user_id);
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
      console.log(error);
      return res.status(400).json({
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
        console.log(getComplaint);
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
      console.log(error);
      return res.json(400).json({
        status: false,
        massage: "Unauthorize Access",
        data: { complaint: null },
      });
    }
  },
  async getPengaduan(req, res) {
    try {
      const { caseViolence } = req.query;
      const getComplaint = await pengaduan.findAll({
        where: { caseViolence },
      });
      if (getComplaint && getComplaint.length > 0) {
        console.log(getComplaint);
        return res.status(200).json({
          status: true,
          massage: "List Pengaduan berdasarkan jenis kekerasan",
          data: { complaint: getComplaint },
        });
      } else {
        return res.status(404).json({
          status: false,
          massage: "List Pengaduan tidak ditemukan",
          data: { complaint: null },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        massage: "Unauthorize Access",
        data: { complaint: null },
      });
    }
  },
  async getComplaintByUserId(req, res) {
    try {
      const userId = req.user.id;
      const result = await pengaduan.findAll({ where: { userId: userId } });
      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Kasus tidak ditemukan",
          data: { complaint: null },
        });
      }
      if (result) {
        return res.status(200).json({
          status: true,
          message: "Berhasil mendapatkan pengaduan",
          data: { complaint: result },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
  async getGender(req, res) {
    try {
      const { gender } = req.query;
      const getComplaint = await pengaduan.findAll({ where: { gender } });
      if (getComplaint && getComplaint.length > 0) {
        return res.status(200).json({
          status: true,
          massage: "List Pengaduan berdasarkan jenis kelamin",
          data: { complaint: getComplaint },
        });
      } else {
        return res.status(404).json({
          status: false,
          massage: "List Pengaduan Tidak di temukan",
          data: { complaint: null },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: false,
        massage: "Unauthorize Access",
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
      console.log(error);
      return res.status(400).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { complaint: null },
      });
    }
  },
};
