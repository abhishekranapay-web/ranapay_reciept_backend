const express = require('express');

const {
  createReceipt,
  getReceiptHistory,
  getSingleReceipt,
  deleteReceipt,
  searchReceipts,
  bulkUploadReceipts
} = require('../controllers/receiptController');
const { requestOTP, verifyOTP } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');




const router = express.Router();

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);


router.post('/create', authMiddleware, createReceipt);
router.get('/search', authMiddleware, searchReceipts);
router.get('/history', authMiddleware, getReceiptHistory);
router.get('/:id', authMiddleware, getSingleReceipt);
router.delete('/:id', authMiddleware, deleteReceipt);
router.post(
  '/bulk-upload',
  upload.single('file'),
  bulkUploadReceipts
);




module.exports = router;