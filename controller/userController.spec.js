const User = require("./userController");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { User } = require("../models");
const userController = require("./userController");

jest.mock("../models");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("#userController", () => {
  describe("#registerAdmin", () => {
    it("should register an admin and return status 200", async () => {
      const req = {
        body: {
          name: "TPDootcom",
          username: "TPDootcom",
          email: "TPDootcom@gmail.com",
          phoneNumber: "111",
          address: "baleni",
          password: "superadmin",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const hashPassword = "hashpassword";
      bcrypt.hash.mockResolvedValue(hashPassword);

      User.create.mockResolvedValue({
        id: 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        password: hashPassword,
      });

      const { registerAdmin } = require("../controller/userController");
      await registerAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "Berhasil melakukan registrasi adamin",
        data: expect.objectContaining({
          id: 1,
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
        }),
      });
    });

    // it("should return 401 if password less than 8 character", async () => {
    //   req.body.password = "short";

    //   await userController.registerAdmin(req, res);
    //   expect(res.status).toHaveBeenCalledWith(401);
    //   expect(res.json).toHaveBeenCalledWith({
    //     status: false,
    //     message: "password minimal 8 karakter",
    //     data: { admin: null },
    //   });
    // });

    // it("should return 402 if email is already registered", async () => {
    //   req.body.email = "TPDootcom@gmail.com";
    //   User.findOne.mockResolvedValue(true);

    //   await userController.registerAdmin(req, res);
    //   expect(res.status).toHaveBeenCalledWith(402);
    //   expect(res.json).toHaveBeenCalledWith({
    //     status: false,
    //     message: "Email sudah didaftarkan",
    //     data: { admin: null },
    //   });
    // });

    // it("should return 400 if server error occurs", async () => {
    //   req.body = {
    //     name: "TPDootcom",
    //     username: "TPDootcom",
    //     email: "TPDootcom@gmail.com",
    //     phoneNumber: "111",
    //     address: "baleni",
    //     password: "superadmin",
    //   };
    //   bcrypt.hash.mockRejectedValue(new Error("Server Error"));

    //   await userController.registerAdmin(req, res);
    //   expect(res.status).toHaveBeenCalledWith(400);
    //   expect(res.json).toHaveBeenCalledWith({
    //     status: false,
    //     message: "Terjadi kesalahan pada server",
    //     data: { admin: null },
    //   });
    // });
  });
});
