function normalizeString(str) {
  if (typeof str !== 'string' || !str) {
    console.warn('Warning: normalizeString received a non-string or empty value:', str);
    return ''; // Returning an empty string or a sensible default
  }
  return str.replace(/[%@#^&*-]/g, '').toLowerCase().trim();
}

const normalizeNodeData = (node) => {
  return {
    ...node,
    label: normalizeString(node.label),
    id: normalizeString(node.id)
  };
};

module.exports = {
  normalizeString,
  normalizeNodeData,
};
