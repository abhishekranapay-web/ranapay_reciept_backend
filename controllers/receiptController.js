const Receipt = require('../models/Receipt');
const generateReceiptId = require('../utils/generateReceiptId');



// Create Receipt
const createReceipt = async (req, res) => {



    try {
        const receipt = await Receipt.create(req.body);

        return res.status(201).json({
            success: true,
            message: 'Receipt created successfully',
            data: receipt,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Receipt number already exists',
            });
        }


        // Validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors)
                    .map((err) => err.message)
                    .join(', '),
            });
        }


        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};




// Get Receipt History with Cursor Pagination
const getReceiptHistory = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor;

        let query = {};

        if (cursor) {
            query._id = { $lt: cursor };
        }

        const receipts = await Receipt.find(query)
            .sort({ _id: -1 })
            .limit(limit + 1);

        let nextCursor = null;

        if (receipts.length > limit) {
            const nextItem = receipts.pop();
            nextCursor = nextItem._id;
        }

        return res.status(200).json({
            success: true,
            count: receipts.length,
            nextCursor,
            data: receipts,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// Get Single Receipt
const getSingleReceipt = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id);

        if (!receipt) {
            return res.status(404).json({
                success: false,
                message: 'Receipt not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: receipt,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Receipt
const deleteReceipt = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id);

        if (!receipt) {
            return res.status(404).json({
                success: false,
                message: 'Receipt not found',
            });
        }

        await receipt.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'Receipt deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




const searchReceipts = async (req, res) => {
    try {
        console.log("Search query:", req.query.search);


        const search = req.query.search || '';

        const receipts = await Receipt.find({
            $or: [
                { receiptNumber: { $regex: search, $options: 'i' } },
                { txnId: { $regex: search, $options: 'i' } },
                { agencyTransactionId: { $regex: search, $options: 'i' } },
                { billNumber: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { accountNumber: { $regex: search, $options: 'i' } },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            count: receipts.length,
            data: receipts,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




module.exports = {
    createReceipt,
    getReceiptHistory,
    getSingleReceipt,
    deleteReceipt,
    searchReceipts
};