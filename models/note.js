"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      note.belongsTo(models.pengaduan, {
        foreignKey: "pengaduanId",
      });
    }
  }
  note.init(
    {
      officerName: DataTypes.STRING,
      description: DataTypes.STRING,
      pengaduanId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "note",
    }
  );
  return note;
};
