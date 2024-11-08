const normalizeString = (str) => {
  if (typeof str !== 'string' || !str) {
    console.warn('Warning: normalizeString received a non-string or empty value:', str);
    return ''; // Returning an empty string or a sensible default
  }

  // Remove emojis using regex, normalize to lowercase, and trim
  return str
    .replace(/[\p{Emoji}\u200D\uFE0F]/gu, '') // Regex for emojis, zero-width joiners, and variation selectors
    .toLowerCase()
    .trim();
};

const removeNonPrintableChars = (str) => str.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

const improvedNormalizeString = (str) => {
  return removeNonPrintableChars(normalizeString(str));
};
