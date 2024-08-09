const { victim } = require("../models");

module.exports = {
  async getGender(req, res) {
    try {
      const getComplaint = await victim.findAll();
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
      const getComplaint = await victim.findAll();

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
};
