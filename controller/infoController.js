const { Informasi } = require("../models");

module.exports = {
  async createInfo(req, res) {
    try {
      const { title, descriptions } = req.body;
      const createInformasi = await Informasi.create({
        title,
        descriptions,
      });
      if (!createInformasi) {
        return res.status(400).json({
          status: false,
          message: "Gagal membuat informasi",
          data: { informasi: null },
        });
      }
      return res.status(200).json({
        status: true,
        message: "Berhasil membuat informasi",
        data: { informasi: createInformasi },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { informasi: null },
      });
    }
  },
  async updateInfo(req, res) {
    try {
      const { title, descriptions } = req.body;
      const updateInformasi = await Informasi.update({
        title,
        descriptions,
      });
      if (!updateInformasi) {
        return res.status(400).json({
          status: false,
          message: "Gagal memperbarui informasi",
          data: { informasi: null },
        });
      }
      return (
        res.status(200),
        json({
          status: true,
          message: "Berhasil memperbarui informasi",
          data: { informasi: updateInformasi },
        })
      );
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { informasi: null },
      });
    }
  },
  async deleteInfo(req, res) {
    try {
      const { id } = req.params;
      const deletedInformasi = await Informasi.destroy({ where: { id } });
      if (!deletedInformasi) {
        return res.status(400).json({
          status: false,
          message: "Gagal menghapus informasi",
          data: { informasi: null },
        });
      }
      return res.status(200).json({
        status: true,
        message: "Berhasil menghapus informasi",
        data: { informasi: deletedInformasi },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { informasi: null },
      });
    }
  },
  async listInfo(req, res) {
    try {
      const listInformasi = await Informasi.findAll();

      if (listInformasi.length > 0) {
        return res.status(200).json({
          status: true,
          massage: "List Infromasi",
          data: { informasi: listInformasi },
        });
      }
    } catch (error) {
      return res.json(500).json({
        status: false,
        massage: "Terjadi kesalahan pada server",
        data: { informasi: null },
      });
    }
  },
  //
};
