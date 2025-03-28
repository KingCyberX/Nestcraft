const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || '12312312312312312312312312312312'; // Must be 32 chars
const IV_LENGTH = 16; // IV must be 16 bytes

const EncryptionHelper = {
  encrypt: (data) => {
    try {
      const iv = crypto.randomBytes(IV_LENGTH); // Generate random IV
      const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'utf-8'), iv);
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
      encrypted += cipher.final('hex');

      return `${iv.toString('hex')}:${encrypted}`; // Return IV + Encrypted data
    } catch (error) {
      console.error('Encryption Error:', error);
      throw new Error('Encryption failed');
    }
  },

  decrypt: (encryptedData) => {
    try {
      const [ivHex, encryptedText] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      
      const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'utf-8'), iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');

      return JSON.parse(decrypted); // Convert back to object
    } catch (error) {
      console.error('Decryption Error:', error);
      throw new Error('Decryption failed');
    }
  }
};

module.exports = EncryptionHelper;
