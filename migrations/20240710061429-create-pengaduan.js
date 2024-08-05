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
      // client
      userid: {
        type: Sequelize.INTEGER,
      },
      // complaint identity
      complaintName: {
        type: Sequelize.STRING,
      },
      complaintAddress: {
        type: Sequelize.STRING,
      },
      complaintEducate: {
        type: Sequelize.STRING,
      },
      complaintNumber: {
        type: Sequelize.STRING,
      },
      complaintRelation: {
        type: Sequelize.STRING,
      },
      // companion identity
      companionName: {
        type: Sequelize.STRING,
      },
      companionAddress: {
        type: Sequelize.STRING,
      },
      companionEducate: {
        type: Sequelize.STRING,
      },
      companionNumber: {
        type: Sequelize.STRING,
      },
      companionRelation: {
        type: Sequelize.STRING,
      },
      // abuser identity
      // case form
      caseType: {
        type: Sequelize.JSON,
      },
      caseViolence: {
        type: Sequelize.JSON,
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
