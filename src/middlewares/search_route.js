import express from 'express';
import searchController from '../controllers/search_controller.js';

const router = express.Router();
const controller = new searchController();

router.get('/rank', controller.getTopSearchTerms);
router.get('/:user_id', controller.searchByKeyword);
router.get('/recent/:user_id', controller.getRecentTerms);
router.delete('/recent/:user_id/delete', controller.deleteSearchTerm);
router.delete('/recent/:user_id/delete/all', controller.deleteAllSearchTerms);
// router.post('/', controller.sort); // 정렬 기준 변경


export default router;