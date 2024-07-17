const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { admin } = require("../models");
const { JWT, ROLES } = require("../lib/const");
const { pengaduan } = require("../models");
const { User } = require("../models");

module.exports = {
  async registerUser(req, res) {
    try {
      const { password } = req.body;
      const user = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        password: await bcrypt.hash(password, JWT.SALT_ROUND),
        role: ROLES.USER,
      });
      res.status(201).json({
        status: "Ok",
        message: "Succesfully Register User",
        data: user,
      });
    } catch (error) {}
  },
  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      console.log("username :", username);
      if (!user) {
        console.log("Email Tak Sama");
        res.status(404).json({
          message: "Can't find that account",
        });
      }
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      console.log(isPasswordCorrect);

      if (!isPasswordCorrect) {
        console.log("Password Tak Sama ");
        req.json({
          message: "Can't find that Account",
        });
        return;
      }
      const token = jwt.sign(
        {
          id: User.id,
          name: User.name,
        },
        JWT.SECRET
      );
      console.log("Generate Token ", token);
      return res.status(200).json({
        message: "Berhasil Login",
        data: token,
      });
    } catch (error) {
      console.log(error);
    }
  },
  async updateUser(req, res) {
    try {
      const token = req.tokenPayload;
      const id = token.id;
      const getUser = await User.findOne({ where: { id } });
      console.log("Current User : ", getUser);

      if (!getUser) {
        return res.status(404).json({
          status: false,
          message: "Can't update user",
        });
      }
      const { name, username, email, phoneNumber, address } = req.body;
      const updateUser = await getUser.update({
        name,
        username,
        email,
        phoneNumber,
        address,
      });
      console.log("Updated User : ", updateUser);
      res.status(200).json({
        status: "OK",
        message: "User Successfuly Updated",
        data: updateUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: false,
        message: "Failed at update user",
      });
    }
  },
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await User.destroy({ where: { id } });
      if (!result) {
        res.status(404).json({
          status: false,
          message: "User not found",
        });
      }
      res.status(200).json({
        message: "User Successfuly Deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: false,
        message: "Something when wrong with the server",
      });
    }
  },
  async getAllUser(req, res) {
    try {
      const user = await User.findAll();
      return res.status(200).json({
        status: "OK",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Cannot get all users",
      });
    }
  },
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }
      if (user) {
        return res.status(200).json({
          data: user,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Something when wrong with the server",
      });
    }
    // const getUser = await User.findOne({ where: { username } });
    // return getUser;
  },
  // async getByEmail(req, res) {
  //   const { email } = req.params;
  //   const getUser = await User.findOne({ where: { email: email } });
  //   if (!getUser) {
  //     res.status(401).json({
  //       status: false,
  //       message: "Cannot get Users",
  //     });
  //   }
  //   return getUser;
  // },
};
