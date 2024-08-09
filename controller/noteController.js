const { where } = require("sequelize");
const { pengaduan, note } = require("../models");

module.exports = {
  async tambahNote(req, res) {
    try {
      const { officerName, description } = req.body;
      const { id } = req.params;
      const getIdComplaint = await pengaduan.findByPk(id);
      const createNote = await note.create({
        officerName,
        description,
        pengaduanId: getIdComplaint.id,
      });
      return res.status(200).json({
        status: true,
        message: "Berhasil menambah note",
        data: { notes: createNote },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "Gagal menambah note",
        data: { notes: null },
      });
    }
  },
  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { officerName, description } = req.body;
      const getNotes = await note.findByPk(id);
      if (!getNotes) {
        return res.status(400).json({
          status: false,
          message: "Notes tidak ada",
          data: { notes: null },
        });
      }
      const updatedNote = await getNotes.update({
        officerName,
        description,
      });
      return res.status(200).json({
        status: true,
        message: "Berhasil memperbarui notes",
        data: { notes: updatedNote },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "Gagal memperbarui notes",
        data: { notes: null },
      });
    }
  },
  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      const deleteNote = await note.destroy({ where: { id } });
      if (!deleteNote) {
        return res.status(404).json({
          status: false,
          message: "Notes tidak ditemukan",
          data: { notes: null },
        });
      }
      return res.status(200).json({
        status: true,
        message: "Berhasil menghapus notes",
        data: { notes: deleteNote },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { notes: null },
      });
    }
  },
  async getAllNote(req, res) {
    try {
      const getNote = await note.findAll();
      return res.status(200).json({
        status: true,
        message: "Berhasil menghapus notes",
        data: { notes: getNote },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        data: { notes: null },
      });
    }
  },
};
