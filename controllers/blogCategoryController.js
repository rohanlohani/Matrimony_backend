// controllers/categoryController.js
const Category = require("../models/blogCategoryModel");

module.exports = {
  // Get all categories
  async getAllCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories", error });
    }
  },

  // Get single category by ID
  async getCategoryById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category", error });
    }
  },

  // Create a new category
  async createCategory(req, res) {
    try {
      const existing = await Category.findOne({
        where: { category_name: req.body.category_name },
      });

      if (existing) {
        return res.status(400).json({ error: "Category already exists" });
      }

      const newCategory = await Category.create(req.body);
      res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating category" });
    }
  },
  // ✅ PATCH: Partially update a category
  async updateCategory(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      await category.update(req.body); // only updates provided fields
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error updating category", error });
    }
  },

  // Delete a category
  async deleteCategory(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category)
        return res.status(404).json({ message: "Category not found" });

      await category.destroy();
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting category", error });
    }
  },
};
