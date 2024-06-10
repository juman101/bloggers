import express from 'express';
import { deleteUser, getUser, getUsers, signout, test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';
const router = express.Router();
import mongoose from 'mongoose';

// Your existing routes
router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);

// New route to fetch user data by userId
router.get('/profile/:userId', async (req, res) => {
  try {
    console.log('hi2');
    const user = await User.findById(req.params.userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/user-by-post/:postId', async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log("Post found:");
    console.log(post);

    // Find the user associated with the post
    const user = await User.findById(post.userId);
    console.log("User found:");
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error finding user by post ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Optional: Keep the route to fetch user data by id
router.get('/:id', async (req, res) => {
  try {
    console.log(req.params);
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
