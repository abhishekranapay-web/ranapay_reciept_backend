const express = require('express');

const {
  createReceipt,
  getReceiptHistory,
  getSingleReceipt,
  deleteReceipt,
  searchReceipts,
} = require('../controllers/receiptController');

const router = express.Router();

router.post('/create', createReceipt);
router.get('/search', searchReceipts);
router.get('/history', getReceiptHistory);
router.get('/:id', getSingleReceipt);
router.delete('/:id', deleteReceipt);
 

module.exports = router;