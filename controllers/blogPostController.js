// controllers/blogPostController.js
const BlogPost = require("../models/blogPostModel");
const Category = require("../models/blogCategoryModel");

module.exports = {
  // Get all blog posts (with category included)
  async getAllPosts(req, res) {
    try {
      const posts = await BlogPost.findAll({ include: Category });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts", error });
    }
  },

  // Get single blog post by ID
  async getPostById(req, res) {
    try {
      const post = await BlogPost.findByPk(req.params.id, {
        include: Category,
      });
      if (!post) return res.status(404).json({ message: "Post not found" });

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching post", error });
    }
  },

  // Create a new blog post
  async createPost(req, res) {
    try {
      const { author_name, title } = req.body;

      // Check if post with same author_name and title exists
      const existing = await BlogPost.findOne({
        where: { author_name, title },
      });

      if (existing) {
        return res
          .status(400)
          .json({ error: "Post with this author and title already exists" });
      }

      const newPost = await BlogPost.create(req.body);
      res.status(201).json({ success: true, data: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating post" });
    }
  },
  // ✅ PATCH: Partially update a blog post
  async updatePost(req, res) {
    try {
      const post = await BlogPost.findByPk(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      await post.update(req.body); // only updates provided fields
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Error updating post", error });
    }
  },

  // Delete a blog post
  async deletePost(req, res) {
    try {
      const post = await BlogPost.findByPk(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      await post.destroy();
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting post", error });
    }
  },
};
