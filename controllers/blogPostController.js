// controllers/blogPostController.js
const BlogPost = require("../models/blogPostModel");
const Category = require("../models/blogCategoryModel.js");

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
    console.log("Incoming Body:", req.body);
    try {
      const postData = {
        title: req.body.title,
        author_name: req.body.author_name,
        excerpt: req.body.excerpt || null,
        content: req.body.content || null,
        category_id: req.body.category_id || null,
        thumbnail: req.file ? req.file.filename : null,
      };

      // Validate required fields
      if (!postData.title || !postData.author_name) {
        return res
          .status(400)
          .json({ error: "Title and author name are required" });
      }

      if (!postData.thumbnail) {
        return res.status(400).json({ error: "Thumbnail image is required" });
      }

      const existing = await BlogPost.findOne({
        where: { author_name: postData.author_name, title: postData.title },
      });

      if (existing) {
        return res
          .status(400)
          .json({ error: "Post with this author and title already exists" });
      }

      // Save new post
      const newPost = await BlogPost.create(postData);

      res.status(201).json({
        message: "Blog post created successfully",
        post: {
          ...newPost.toJSON(),
          thumbnail: `/uploads/${newPost.thumbnail}`, // prepend uploads path
        },
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  },
  // ✅ PATCH: Partially update a blog post
  async updatePost(req, res) {
    try {
      const post = await BlogPost.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Build updated data dynamically
      const updatedData = {
        title: req.body.title || post.title,
        author_name: req.body.author_name || post.author_name,
        excerpt: req.body.excerpt ?? post.excerpt,
        content: req.body.content ?? post.content,
        category_id: req.body.category_id || post.category_id,
        thumbnail: req.file ? req.file.filename : post.thumbnail, // use new file if uploaded
      };

      await post.update(updatedData);

      res.status(200).json({
        message: "Post updated successfully",
        post: {
          ...post.toJSON(),
          thumbnail: `/uploads/${updatedData.thumbnail}`,
        },
      });
    } catch (error) {
      console.error("Error updating post:", error);
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
