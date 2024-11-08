// ./src/utils/normalize-utils.js

// Remove emojis and unwanted characters, normalize to lowercase, and trim
const normalizeString = (str) => {
  if (typeof str !== 'string' || !str) {
    console.warn('Warning: normalizeString received a non-string or empty value:', str);
    return ''; // Returning an empty string or a sensible default
  }

  // Remove emojis, zero-width joiners, and variation selectors
  return str
    .replace(/[\p{Emoji}\u200D\uFE0F]/gu, '')
    .toLowerCase()
    .trim();
};

// Remove non-printable characters
const removeNonPrintableChars = (str) => str.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

// Combined function to ensure complete cleanup
const improvedNormalizeString = (str) => {
  return removeNonPrintableChars(normalizeString(str));
};

// Export the improved normalization function
module.exports = {
  normalizeString,  // Keep this in case other parts of your code use it directly
  removeNonPrintableChars,
  improvedNormalizeString, // Use this moving forward
};
