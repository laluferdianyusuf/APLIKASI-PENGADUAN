const { where } = require("sequelize");
const { pengaduan } = require("../models");

module.exports = {
  async complaintClient(req, res) {
    try {
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
      // Cek jika caseViolence adalah "fisik"
      if (caseViolence == "fisik" && !physical) {
        return res.status(200).json({
          status: false,
          message: "isRequire",
        });
      }
      if (caseViolence == "sexual" && !sexual) {
        return res.status(200).json({
          status: false,
          message: "isRequire",
        });
      }
      if (caseViolence == "psikologi" && !psychology) {
        return res.status(200).json({
          status: false,
          message: "isRequire",
        });
      }
      if (caseViolence == "ekonomi" && !economy) {
        return res.status(200).json({
          status: false,
          message: "isRequire",
        });
      }
      // Buat pengaduan baru
      const createPengaduan = await pengaduan.create({
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
      });

      // Kembalikan respons berhasil
      return res.status(201).json({
        status: "OK",
        message: "Successfully created complaint",
        data: createPengaduan,
      });
    } catch (error) {
      console.error(error);
      // Kembalikan respons gagal
      return res.status(500).json({
        status: false,
        message: "Failed to create complaint",
        data: null,
      });
    }
  },

  async updatePengaduan(req, res) {
    try {
      const { id } = req.params;
      const getPengaduanById = await pengaduan.findByPk(id); // Menggunakan findByPk untuk mencari berdasarkan primary key

      if (!getPengaduanById) {
        return res.status(404).json({
          status: false,
          message: "Pengaduan not found",
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

      // Cek jika caseViolence adalah "fisik" dan physical tidak diisi
      if (caseViolence === "fisik" && !physical) {
        return res.status(400).json({
          status: "FAIL",
          message: "Physical details are required for physical violence cases",
        });
      }

      const updatePengaduan = await getPengaduanById.update({
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
      });

      res.status(200).json({
        status: true,
        message: "Update Sukses",
        data: updatePengaduan,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Failed to update complaint",
        data: null,
      });
    }
  },

  async deletePengaduan(req, res) {
    try {
      const { id } = req.params;
      const result = await pengaduan.destroy({ where: { id } });
      if (!result) {
        res.status(404).json({
          deletedby: req.result,
          message: "Complaint not found",
        });
      }
      res.json({
        message: "Complaint Successfully deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "something went wrong with the server",
      });
    }
  },
  async getAllCase(req, res) {
    try {
      const getComplaint = await pengaduan.findAll();
      if (getComplaint) {
        console.log(getComplaint);
        res.status(200).json({
          massage: "Complaint List",
          data: getComplaint,
        });
      } else {
        res.status(404).json({
          massage: "Complain list not found",
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      res.json(404).json({
        massage: "Unauthorize Access",
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
        res.status(200).json({
          massage: "Complaint List",
          data: getComplaint,
        });
      } else {
        res.status(404).json({
          massage: "Complain list not found",
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      res.json(404).json({
        massage: "Unauthorize Access",
      });
    }
  },
  async getGender(req, res) {
    try {
      const { gender } = req.query;
      const getComplaint = await pengaduan.findAll({ where: { gender } });
      if (getComplaint && getComplaint.length > 0) {
        console.log(getComplaint);
        res.status(200).json({
          massage: "Complaint List",
          data: getComplaint,
        });
      } else {
        res.status(404).json({
          massage: "Complain list not found",
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      res.json(404).json({
        massage: "Unauthorize Access",
      });
    }
  },
};
