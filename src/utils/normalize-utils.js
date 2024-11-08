// Helper function to normalize strings by removing emojis, converting whitespace to underscores, and changing to uppercase
const normalizeString = (str) => {
  if (typeof str !== 'string' || !str) {
    console.warn('Warning: normalizeString received a non-string or empty value:', str);
    return ''; // Returning an empty string or a sensible default
  }
  // Remove emojis using regex, replace whitespace with underscores, convert to uppercase, and trim
  return str
    .replace(/[\u{1F300}-\u{1F5FF}|\u{1F600}-\u{1F64F}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, '_')
    .toUpperCase()
    .trim();
};

module.exports = {
  normalizeUUID,
  normalizeString,
};