export function parseForm(field) {
  Object.keys(field).forEach(key => {
    if (!field[key] && field[key] !== 0 && field[key] !== false) {
      field[key] = null;
    } else if (typeof field[key] === 'object' && !Array.isArray(field[key])) {
      field[key] = parseForm(field[key]);
    }
  });
  return field;
}
