const generateReceiptId = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RANA${Date.now()}${random}`;
};

module.exports = generateReceiptId;