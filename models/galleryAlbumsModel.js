const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const GalleryAlbums = sequelize.define(
  "GalleryAlbums",
  {
    album_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    album_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    album_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cover_image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "gallery_albums",
    timestamps: true, // Sequelize will now automatically create 'createdAt' and 'updatedAt'
  }
);

module.exports = GalleryAlbums;
