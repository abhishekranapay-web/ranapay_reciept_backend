const Receipt = require('../models/Receipt');
const generateReceiptId = require('../utils/generateReceiptId');

const parseReceiptFile = require('../utils/parseReceiptFile');
const {
  toWords,
} = require('number-to-words');


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






const excelDateToJSDate = (
  excelDate
) => {
  if (
    !excelDate ||
    typeof excelDate !== 'number'
  ) {
    return excelDate;
  }

  const excelEpoch =
    new Date(1899, 11, 30);

  return new Date(
    excelEpoch.getTime() +
      excelDate *
        24 *
        60 *
        60 *
        1000
  );
};


const formatDate = (date) => {
  if (!date) return null;

  const d = new Date(date);

  const yyyy =
    d.getFullYear();

  const mm = String(
    d.getMonth() + 1
  ).padStart(2, '0');

  const dd = String(
    d.getDate()
  ).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
};





// CONVERT AMOUNT TO WORDS

const convertAmountToWords = (
  amount
) => {
  if (!amount) return '';

  return toWords(
    Number(amount)
  ).toUpperCase();
};





const bulkUploadReceipts = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required',
      });
    }

    const rows =
      await parseReceiptFile(req.file);

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: 'File is empty',
      });
    }

    const validReceipts = [];
    const invalidRows = [];


    const txnIdSet = new Set();

    const agencyTxnIdSet =
      new Set();


    for (let i = 0; i < rows.length; i++) {
      // const row = rows[i];

      try {



           const rawRow = rows[i];

        // ========================================
        // NORMALIZE ROW
        // ========================================
        const row = {
          txnId:
            rawRow.txnId ||
            rawRow['Txn Id'] ||
            rawRow['TXN ID'] ||
            '',

          agencyTransactionId:
            rawRow.agencyTransactionId ||
            rawRow[
              'Agency Transaction Id'
            ] ||
            '',

          billNumber:
            rawRow.billNumber ||
            rawRow[
              'Bill Number'
            ] ||
            '',

          customerName:
            rawRow.customerName ||
            rawRow[
              'Customer Name'
            ] ||
            '',

          accountNumber:
            rawRow.accountNumber ||
            rawRow[
              'Account Number'
            ] ||
            '',

          mobileNumber:
            rawRow.mobileNumber ||
            rawRow[
              'Mobile Number'
            ] ||
            '',

          totalPayableAmount:
            rawRow.totalPayableAmount ||
            rawRow[
              'Total Payable Amount'
            ] ||
            0,

          amountPaid:
            rawRow.amountPaid ||
            rawRow[
              'Amount Paid'
            ] ||
            0,

          amountPaidWords:
            rawRow.amountPaidWords ||
            rawRow[
              'Amount Paid Words'
            ] ||
            '',

          connectionType:
            rawRow.connectionType ||
            rawRow[
              'Connection Type'
            ] ||
            '',

          discom:
            rawRow.discom ||
            rawRow[
              'Discom'
            ] ||
            '',

          area:
            rawRow.area ||
            rawRow['Area'] ||
            '',

          division:
            rawRow.division ||
            rawRow[
              'Division'
            ] ||
            '',

          agentName:
            rawRow.agentName ||
            rawRow[
              'Agent Name'
            ] ||
            '',

          agentMobile:
            rawRow.agentMobile ||
            rawRow[
              'Agent Mobile'
            ] ||
            '',

          agentId:
            rawRow.agentId ||
            rawRow[
              'Agent Id'
            ] ||
            '',

          transactionStatus:
            rawRow.transactionStatus ||
            rawRow[
              'Transaction Status'
            ] ||
            'SUCCESS',

          paymentDate:
            rawRow.paymentDate ||
            rawRow[
              'Payment Date'
            ] ||
            '',

          paymentMode:
            rawRow.paymentMode ||
            rawRow[
              'Payment Mode'
            ] ||
            '',

          agencyName:
            rawRow.agencyName ||
            rawRow[
              'Agency Name'
            ] ||
            'RANAPAY INDIA PRIVATE LIMITED',

          paymentStatus:
            rawRow.paymentStatus ||
            rawRow[
              'Payment Status'
            ] ||
            'SUCCESS',
        };

        // ========================================
        // CONVERT EXCEL DATE
        // ========================================
        row.paymentDate =
          formatDate(
            excelDateToJSDate(
              row.paymentDate
            )
          );


            row.amountPaidWords =
            convertAmountToWords(
              row.amountPaid
            );

            


          
        // REQUIRED VALIDATION
        if (

          !row.txnId ||
          !row.agencyTransactionId
        ) {
          invalidRows.push({
            row: i + 1,
            error:
              'txnId, agencyTransactionId required',
            data: row,
          });

          continue;
        }


        txnIdSet.add(row.txnId);



        // AGENCY TRANSACTION ID
        // ================================
        if (
          row.agencyTransactionId
        ) {
          if (
            agencyTxnIdSet.has(
              row.agencyTransactionId
            )
          ) {
            invalidRows.push({
              row: i + 1,
              error:
                'Duplicate agencyTransactionId inside uploaded file',
              data: row,
            });

            continue;
          }

          agencyTxnIdSet.add(
            row.agencyTransactionId
          );
        }




        // ================================
        // CHECK DB DUPLICATES
        // ================================
        const existingTxn =
          await Receipt.exists({
            txnId: row.txnId,
          });

        if (existingTxn) {
          invalidRows.push({
            row: i + 1,
            error:
              'txnId already exists',
            data: row,
          });

          continue;
        }






        if (
          row.agencyTransactionId
        ) {
          const existingAgencyTxn =
            await Receipt.exists({
              agencyTransactionId:
                row.agencyTransactionId,
            });

          if (
            existingAgencyTxn
          ) {
            invalidRows.push({
              row: i + 1,
              error:
                'agencyTransactionId already exists',
              data: row,
            });

            continue;
          }
        }




        // ================================
        // AUTO GENERATE RECEIPT NUMBER
        // ================================
        const receiptNumber =
          await generateUniqueReceiptNumber();





        validReceipts.push({
          ...row,

          receiptNumber,

          paymentStatus:
            row.paymentStatus ||
            'SUCCESS',

          agencyName:
            row.agencyName ||
            'RANAPAY INDIA PRIVATE LIMITED',
        });
      } catch (err) {
        invalidRows.push({
          row: i + 1,
          error: err.message,
          data: row,
        });
      }
    }

    // INSERT VALID DATA
    let inserted = [];

    if (validReceipts.length) {
      inserted =
        await Receipt.insertMany(
          validReceipts,
          {
            ordered: false,
          }
        );
    }

    return res.status(201).json({
      success: true,

      totalRows: rows.length,

      insertedCount:
        inserted.length,

      failedCount:
        invalidRows.length,

      failedRows: invalidRows,

      inserted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        'Internal server error',
    });
  }
};






// GENERATE UNIQUE RECEIPT NUMBER
// ================================
const generateReceiptNumber = () => {
  const date = new Date();

  const yyyy = date.getFullYear();

  const mm = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const dd = String(
    date.getDate()
  ).padStart(2, '0');

  const datePart = `${yyyy}${mm}${dd}`;

  const random =
    Math.floor(
      10000000 +
      Math.random() * 90000000
    )
      .toString()
      .slice(0, 8);

  return `RPA${datePart}${random}`.slice(
    0,
    17
  );
};




// ================================
// GENERATE UNIQUE RECEIPT NUMBER
// DB SAFE
// ================================
const generateUniqueReceiptNumber =
  async () => {
    let receiptNumber;
    let exists = true;

    while (exists) {
      receiptNumber =
        generateReceiptNumber();

      exists =
        await Receipt.exists({
          receiptNumber,
        });
    }

    return receiptNumber;
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
  searchReceipts,
  bulkUploadReceipts
};