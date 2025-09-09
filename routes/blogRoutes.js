// routes/categoriesRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const categoryController = require("../controllers/blogCategoryController");
const blogPostController = require("../controllers/blogPostController");

// Category Routes
router.get("/categories", categoryController.getAllCategories);
router.get("/category/:id", categoryController.getCategoryById);
router.post("/category", categoryController.createCategory);
router.patch("/category/:id", categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);

// Blog Post Routes
router.get("/", blogPostController.getAllPosts);
router.get("/:id", blogPostController.getPostById);
router.post("/", upload.single("thumbnail"), blogPostController.createPost);
router.patch("/:id", upload.single("thumbnail"), blogPostController.updatePost);
router.delete("/:id", blogPostController.deletePost);

module.exports = router;
