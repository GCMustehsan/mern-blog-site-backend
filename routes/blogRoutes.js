const express = require("express")
const { body, validationResult } = require("express-validator")
const Blog = require("../models/Blog")

const router = express.Router()

// Validation middleware
const validateBlog = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ max: 50 })
    .withMessage("Author name cannot exceed 50 characters"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
]

// GET /api/blogs - Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 })
    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
    })
  }
})

// GET /api/blogs/:id - Get single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      })
    }

    res.json({
      success: true,
      data: blog,
    })
  } catch (error) {
    console.error("Error fetching blog:", error)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      })
    }
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
    })
  }
})

// POST /api/blogs - Create new blog
router.post("/", validateBlog, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { title, content, author, tags } = req.body

    const blog = new Blog({
      title,
      content,
      author,
      tags: tags || [],
    })

    const savedBlog = await blog.save()

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: savedBlog,
    })
  } catch (error) {
    console.error("Error creating blog:", error)
    res.status(500).json({
      success: false,
      message: "Error creating blog",
    })
  }
})

// PUT /api/blogs/:id - Update blog
router.put("/:id", validateBlog, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { title, content, author, tags } = req.body

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, author, tags: tags || [] },
      { new: true, runValidators: true },
    )

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      })
    }

    res.json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    })
  } catch (error) {
    console.error("Error updating blog:", error)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      })
    }
    res.status(500).json({
      success: false,
      message: "Error updating blog",
    })
  }
})

// DELETE /api/blogs/:id - Delete blog
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      })
    }

    res.json({
      success: true,
      message: "Blog deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting blog:", error)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      })
    }
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
    })
  }
})

module.exports = router
