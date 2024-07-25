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
        return res.status(401).json({
          status: false,
          message: "Failed create information",
          data: { informasi: null },
        });
      }
      return res.status(200).json({
        status: true,
        message: "Successfully created information",
        data: { informasi: createInformasi },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "Something error with the server",
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
        return res.status(401).json({
          status: false,
          message: "Failed to update information",
          data: { informasi: null },
        });
      }
      return (
        res.status(200),
        json({
          status: true,
          message: "Successfuly updated information",
          data: { informasi: updateInformasi },
        })
      );
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something error with the server",
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
          message: "Failed deleted information",
          data: { informasi: deletedInformasi },
        });
      }
      return res.status(200).json({
        status: true,
        message: "Successfuly deleted information",
        data: { informasi: deletedInformasi },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "Something error with the server ",
        data: { informasi: deletedInformasi },
      });
    }
  },
  async listInfo(req, res) {
    try {
      const listInformasi = await Informasi.findAll();

      if (listInformasi.length > 0) {
        console.log(listInformasi);
        return res.status(200).json({
          status: true,
          massage: "List Infromasi",
          data: { informasi: listInformasi },
        });
      }
    } catch (error) {
      console.log(error);
      return res.json(400).json({
        status: false,
        massage: "Terjadi kesalahan pada server",
        data: { informasi: null },
      });
    }
  },
  //
};
