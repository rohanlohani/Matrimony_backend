// models/blogPostModel.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Category = require("./blogCategoryModel.js");

const BlogPost = sequelize.define(
  "BlogPost",
  {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    publish_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "category_id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "blog_posts",
    timestamps: true,
  }
);

Category.hasMany(BlogPost, { foreignKey: "category_id" });
BlogPost.belongsTo(Category, { foreignKey: "category_id" });

module.exports = BlogPost;
