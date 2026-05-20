const XLSX = require('xlsx');

const parseReceiptFile = async (file) => {
  const workbook = XLSX.read(file.buffer, {
    type: 'buffer',
  });

  const sheetName =
    workbook.SheetNames[0];

  const worksheet =
    workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(
    worksheet
  );
};

module.exports = parseReceiptFile;