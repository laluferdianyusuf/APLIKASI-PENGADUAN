"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pengaduan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pengaduan.init(
    {
      name: DataTypes.STRING,
      born: DataTypes.STRING,
      gender: DataTypes.STRING,
      nik: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      education: DataTypes.STRING,
      // client Parents
      parentName: DataTypes.STRING,
      parentJob: DataTypes.STRING,
      parentAddress: DataTypes.STRING,
      parentNumber: DataTypes.STRING,
      // case form
      caseType: DataTypes.STRING,
      caseViolence: DataTypes.STRING,
      physical: DataTypes.STRING,
      sexual: DataTypes.STRING,
      psychology: DataTypes.STRING,
      economy: DataTypes.STRING,
      chronology: DataTypes.STRING,
      status: DataTypes,
      STRING,
    },
    {
      sequelize,
      modelName: "pengaduan",
    }
  );
  return pengaduan;
};
