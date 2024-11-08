const normalizeString = (str) => {
  if (typeof str !== 'string' || !str) {
    console.warn('Warning: normalizeString received a non-string or empty value:', str);
    return ''; // Returning an empty string or a sensible default
  }
  
  // Remove emojis using regex, normalize to lowercase, and trim
  return str
    .replace(/[\u{1F300}-\u{1F5FF}|\u{1F600}-\u{1F64F}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '') // Regex for most common emojis
    .toLowerCase()
    .trim();
};

module.exports = {
  normalizeString,
};
