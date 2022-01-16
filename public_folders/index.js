const fs = require('fs');

const PORT = process.env.PORT;
const FOLDERS = process.env.FOLDERS;

const directories = { };

for (let str in FOLDERS.split("\n"))
{
	let split = str.split(":");
	directories[slpit[1]] = split[2];
}

console.log(`Starting public folders service on ${port}`);

console.log(`Serving public folders:`, directories);


