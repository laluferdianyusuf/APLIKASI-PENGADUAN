"use strict";
const bcrypt = require("bcrypt");
const { JWT } = require("../lib/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("superadmin", JWT.SALT_ROUND);

    await queryInterface.bulkInsert("users", [
      {
        name: "TPDotcom",
        username: "TPDotcom",
        email: "TPDotcom@gmail.com",
        phoneNumber: "111",
        address: "baleni",
        password: hashedPassword,
        role: "superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", null, {});
  },
};
