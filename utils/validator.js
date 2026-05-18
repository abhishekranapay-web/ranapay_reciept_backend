/**
 * Basic Email Validator
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Basic Phone Number Validator (supports 10 digits)
 * @param {string} phone 
 * @returns {boolean}
 */
const isValidPhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};

module.exports = {
    isValidEmail,
    isValidPhone
};
