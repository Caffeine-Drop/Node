import express from 'express';
import SearchController from '../controllers/search_controller.js';
import { authenticateToken } from './authMiddleware.js';

const router = express.Router();
const controller = new SearchController();

router.get('/rank', authenticateToken, controller.getTopSearchTerms);
router.get('/', authenticateToken, controller.searchByKeyword);
router.get('/recent', authenticateToken, controller.getRecentTerms);
router.delete('/recent/delete', authenticateToken, controller.deleteSearchTerm);
router.delete('/recent/delete/all', authenticateToken, controller.deleteAllSearchTerms);

export default router;