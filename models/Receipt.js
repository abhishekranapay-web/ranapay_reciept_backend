const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    // Receipt Details
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
            trim: true,
    },

    txnId: {
      type: String,
      required: true,
            trim: true,
    },

    agencyTransactionId: {
      type: String,
      required: true,
            trim: true,
                  trim: true,
    },

    billNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // Customer Details
    customerName: {
      type: String,
      required: true,
            trim: true,
    },

    accountNumber: {
      type: String,
      required: true,
            trim: true,
    },

    mobileNumber: {
      type: String,
      default: '',
    },

    // Amount Details
    totalPayableAmount: {
      type: Number,
      required: true,
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    amountPaidWords: {
      type: String,
      required: true,
    },

    // Connection Details
    connectionType: {
      type: String,
      default: '',
    },

    discom: {
      type: String,
      default: '',
    },

    area: {
      type: String,
      default: '',
    },

    division: {
      type: String,
      default: '',
    },

    // Agent Details
    agentName: {
      type: String,
      default: '',
    },

    agentMobile: {
      type: String,
      default: '',
    },

    agentId: {
      type: String,
      default: '',
    },

    // Payment Details
    paymentDate: {
      type: String,
      required: true,
    },

    paymentMode: {
      type: String,
      default: 'PG',
    },

    transactionStatus: {
      type: String,
      default: 'SUCCESS',
    },

    paymentStatus: {
      type: String,
      default: 'SUCCESS',
    },

    // Company
    agencyName: {
      type: String,
      default: 'RANAPAY INDIA PRIVATE LIMITED',
    },
  },
  {
    timestamps: true,
  }
);

receiptSchema.index({ receiptNumber: 1 });
receiptSchema.index({ txnId: 1 });
receiptSchema.index({ agencyTransactionId: 1 });
receiptSchema.index({ billNumber: 1 });
receiptSchema.index({ customerName: 1 });
receiptSchema.index({ accountNumber: 1 });

module.exports = mongoose.model('Receipt', receiptSchema);