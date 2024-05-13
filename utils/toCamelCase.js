// Helper function to convert snake case to camel case
const toCamelCase = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    acc[camelKey] = obj[key];
    return acc;
  }, {});
};

module.exports = toCamelCase;
