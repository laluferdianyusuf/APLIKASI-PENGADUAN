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
      pengaduan.hasMany(models.victim, {
        foreignKey: "pengaduanId",
      });
      pengaduan.hasMany(models.abuser, {
        foreignKey: "pengaduanId",
      });
      pengaduan.hasMany(models.minat, {
        foreignKey: "pengaduanId",
      });
    }
  }
  pengaduan.init(
    {
      // complaint identity
      userid: DataTypes.INTEGER,
      complaintName: DataTypes.STRING,
      complaintAddress: DataTypes.STRING,
      complaintEducate: DataTypes.STRING,
      complaintNumber: DataTypes.STRING,
      complaintRelation: DataTypes.STRING,
      // Companion identity
      companionName: DataTypes.STRING,
      companionAddress: DataTypes.STRING,
      companionEducate: DataTypes.STRING,
      companionNumber: DataTypes.STRING,
      companionRelation: DataTypes.STRING,
      // case form
      caseType: DataTypes.JSON,
      caseViolence: DataTypes.JSON,
      physical: DataTypes.STRING,
      sexual: DataTypes.STRING,
      psychology: DataTypes.STRING,
      economy: DataTypes.STRING,
      chronology: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "pengaduan",
    }
  );
  return pengaduan;
};
