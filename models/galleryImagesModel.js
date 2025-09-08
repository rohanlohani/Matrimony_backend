const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const GalleryAlbums = require("./galleryAlbumsModel");

const GalleryImages = sequelize.define(
  "GalleryImages",
  {
    image_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: GalleryAlbums,
        key: "album_id",
      },
      onDelete: "CASCADE",
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "gallery_images",
    timestamps: true, // Sequelize will automatically create 'createdAt' and 'updatedAt'
  }
);

// Associations
GalleryAlbums.hasMany(GalleryImages, { foreignKey: "album_id" });
GalleryImages.belongsTo(GalleryAlbums, { foreignKey: "album_id" });

module.exports = GalleryImages;
