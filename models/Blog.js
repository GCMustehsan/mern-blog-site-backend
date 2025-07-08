const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
    maxlength: [50, "Author name cannot exceed 50 characters"],
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Update the updatedAt field before updating
blogSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() })
  next()
})

module.exports = mongoose.model("Blog", blogSchema)
