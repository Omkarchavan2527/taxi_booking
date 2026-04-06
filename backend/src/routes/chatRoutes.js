import express from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require user to be logged in
router.use(protect);

router.get('/:rideId/messages', getMessages);
router.post('/:rideId/messages', sendMessage);

export default router;