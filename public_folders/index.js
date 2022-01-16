const fs = require('fs');

const port = process.env.PORT;
const folders = process.env.FOLDERS;

console.log(`Starting public folders service on ${port}`);

console.log(`Folders: `, folders);
