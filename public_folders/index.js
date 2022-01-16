const fs = require('fs');

const PORT = process.env.PORT;
const FOLDERS = process.env.FOLDERS;

const directories = { };

for (let str of FOLDERS.split("\n"))
{
	let split = str.split(":");
	directories[split[0]] = split[1];
}

console.log(`Starting public folders service on ${PORT}`);

console.log(`Serving public folders:`, directories);


