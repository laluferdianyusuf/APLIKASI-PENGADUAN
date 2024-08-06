const { User, minat } = require("../models");

module.exports = {
  async tambahMinat(req, res) {
    try {
      const user_id = req.user.id;
      const { pelatihan } = req.body;
      const createMinat = await minat.create({
        userId: user_id,
        pelatihan,
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
