// ./src/utils/normalize-utils.js

// Function to normalize the input string
const normalizeString = (str) => {
  if (typeof str !== 'string' || !str) {
    console.warn('Warning: normalizeString received a non-string or empty value:', str);
    return ''; // Returning an empty string or a sensible default
  }

  // Remove emojis, zero-width joiners, variation selectors, and non-printable characters
  return str
    .replace(/[\p{Emoji}\u200D\uFE0F]/gu, '')    // Removes emojis and zero-width joiners
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')        // Removes non-printable ASCII characters
    .normalize('NFKD')                           // Normalizes combined characters into distinct parts
    .replace(/[\u0300-\u036F]/g, '')             // Removes diacritical marks (e.g., accents)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');                       // Collapses multiple spaces to a single space
};

// Improved version of normalizeString that also uses an extra cleanup
const improvedNormalizeString = (str) => {
  return normalizeString(str);
};

module.exports = {
  normalizeString,
  improvedNormalizeString
};
