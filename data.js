const fs = require('fs');

const data = new Float32Array([
  0, 0, 0, 0,
  150, 0, 1, 0,
  0, 150, 0, 1
]);

fs.writeFile('data.data', data, { mode: null }, console.log);