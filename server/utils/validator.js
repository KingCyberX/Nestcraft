class Validator {
    static isValidEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }
  
    static isValidPassword(password) {
      return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
    }
  }
  
  module.exports = Validator;
  