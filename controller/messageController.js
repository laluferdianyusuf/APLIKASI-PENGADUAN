const { messages } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  async createMessage(req, res, next) {
    try {
      const { text, senderId, receiverId } = req.body;
      const message = await messages.create({ text, senderId, receiverId });
      res.status(200).json({
        status: true,
        message: "success",
        data: {
          message: message,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "error" + error,
        data: {
          message: null,
        },
      });
    }
  },
  async getMessage(req, res, next) {
    const { senderId, receiverId } = req.query;

    try {
      const message = await messages.findAll({
        where: {
          [Op.or]: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        order: [["timestamp", "ASC"]],
      });

      res.status(200).json({
        status: true,
        message: "Success",
        data: { message },
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({
        status: false,
        message: "Error fetching messages",
      });
    }
  },
  async getMessageById(req, res) {
    try {
      const id = req.user.id;

      const message = await messages.findAll({
        where: { userId: id },
        order: [["timestamp", "DESC"]],
      });

      if (message.length > 0) {
        res.status(200).json({
          status: true,
          message: "success",
          data: {
            message: message,
          },
        });
      } else {
        res.status(404).json({
          status: false,
          message: "no message available",
          data: {
            message: null,
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "error" + error,
        data: {
          message: null,
        },
      });
    }
  },

  async deleteMessage(req, res) {
    const messageId = req.params;
    try {
      const message = await messages.destroy({ where: { id: messageId } });
      if (message) {
        res.status(200).json({
          status: true,
          message: "Success",
          data: { message },
        });
      }
    } catch (error) {
      console.error("Error delete message:", error);
      res.status(500).json({
        status: false,
        message: "Error delete message",
      });
    }
  },
};
