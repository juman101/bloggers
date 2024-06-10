import Post from '../models/post.model.js';
import User from '../models/user.model.js'; // Make sure to import the User model
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';
export const create = async (req, res, next) => {
  const { title, content } = req.body;

  // Check if the user is an admin
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }

  // Validate request body
  if (!title || !content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  // Generate slug from the title
  const slug = title
    .trim()
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[^a-z0-9-]/g, '');

  // Create new post object
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  // Save the new post to the database
  try {
    const savedPost = await newPost.save();

    // Update the user's posts array with the new post ID
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { posts: savedPost._id } },
      { new: true }
    );

    res.status(201).json(savedPost);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error saving post:', error);
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    };

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(query);

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching posts:', error);
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }

  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error deleting post:', error);
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error updating post:', error);
    next(error);
  }
};