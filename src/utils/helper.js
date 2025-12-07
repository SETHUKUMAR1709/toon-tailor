function jsonToToon(jsonData) {
  let toonString = '';

  function processObject(obj, indentLevel) {
    let indent = '  '.repeat(indentLevel);
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            toonString += `${indent}${key}:\n`;
            processArray(value, indentLevel + 1);
          } else {
            toonString += `${indent}${key}:\n`;
            processObject(value, indentLevel + 1);
          }
        } else {
          toonString += `${indent}${key}: "${value}"\n`; // Wrap primitive values in quotes for consistency
        }
      }
    }
  }

  function processArray(arr, indentLevel) {
    if (arr.length === 0) return;

    // Assuming uniform objects in the array for TOON's efficiency
    const firstItem = arr[0];
    if (typeof firstItem === 'object' && firstItem !== null) {
      const headers = Object.keys(firstItem).join(',');
      toonString += `${'  '.repeat(indentLevel)}{${headers}}\n`;
      arr.forEach(item => {
        const values = Object.values(item).map(val => `"${val}"`).join(','); // Wrap values in quotes
        toonString += `${'  '.repeat(indentLevel)}${values}\n`;
      });
    } else {
      // Handle array of primitives
      arr.forEach(item => {
        toonString += `${'  '.repeat(indentLevel)}"${item}"\n`;
      });
    }
  }

  // Parse the input if it's a JSON string
  let data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      processArray(data, 0);
    } else {
      processObject(data, 0);
    }
  } else {
    toonString = `"${data}"`; // Handle primitive root
  }

  return toonString.trim();
}

export {jsonToToon};