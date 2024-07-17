"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pengaduans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userid: {
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      born: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      nik: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      education: {
        type: Sequelize.STRING,
      },
      // client Parents
      parentName: {
        type: Sequelize.STRING,
      },
      parentJob: {
        type: Sequelize.STRING,
      },
      parentAddress: {
        type: Sequelize.STRING,
      },
      parentNumber: {
        type: Sequelize.STRING,
      },
      // case form
      caseType: {
        type: Sequelize.STRING,
      },
      caseViolence: {
        type: Sequelize.STRING,
      },
      physical: {
        type: Sequelize.STRING,
      },
      sexual: {
        type: Sequelize.STRING,
      },
      psychology: {
        type: Sequelize.STRING,
      },
      economy: {
        type: Sequelize.STRING,
      },
      chronology: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pengaduans");
  },
};
