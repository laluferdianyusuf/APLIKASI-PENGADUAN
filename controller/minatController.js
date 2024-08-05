const { User, minat } = require("../models");

module.exports = {
  async tambahMinat(req, res) {
    try {
      const user_id = req.user.id;
      const { pelatihan, batik, masak, salon, etc } = req.body;
      if (pelatihan == "membatik" && !batik) {
        return res.status(200).json({
          status: true,
          message: "Alasan",
          data: { minat: null },
        });
      }
      if (pelatihan == "memasak" && !masak) {
        return res.status(200).json({
          status: true,
          message: "Alasan",
          data: { minat: null },
        });
      }
      if (pelatihan == "menyalon" && !salon) {
        return res.status(200).json({
          status: true,
          message: "Alasan",
          data: { minat: null },
        });
      }
      if (pelatihan == "dll" && !etc) {
        return res.status(200).json({
          status: true,
          message: "Alasan",
          data: { minat: null },
        });
      }
      const createMinat = await minat.create({
        userId: user_id,
        pelatihan,
        batik,
        masak,
        salon,
        etc,
      });
      return res.status(200).json({
        status: true,
        message: "Berhasil membuat minat",
        data: { minat: createMinat },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "Gagal membuat minat",
        data: { minat: null },
      });
    }
  },
};
