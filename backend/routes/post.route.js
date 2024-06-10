import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts, updatepost } from '../controllers/post.controller.js';
import mongoose from 'mongoose';
const router = express.Router();
import Post from '../models/post.model.js';
router.post('/create', verifyToken, create)

  router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)

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

      res.status(200).json(post);
    } catch (error) {
      console.error('Error finding user by post ID:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;