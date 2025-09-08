const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const HomePageSlider = sequelize.define(
  "HomePageSlider",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_path: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    alt_text: {
      type: DataTypes.STRING(150),
      allowNull: true, // optional
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "home_page_sliders",
    timestamps: false,
  }
);

module.exports = HomePageSlider;
