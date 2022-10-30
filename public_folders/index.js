//Modules
const fs = require('fs');
const http = require('http');
const path = require('path');

//Config
const PORT = process.env.PORT;
const FOLDERS = process.env.FOLDERS;
const LISTDIRS = process.env.DIRECTORY_LISTING;
const LOGGING = process.env.REQUEST_LOGGING;

console.log("Dumping Enivroment Vars:");
console.log(process.env);
console.log("--------------------------------------------------");

//List settings
console.log(`Setting Request Logging: ${LOGGING ? "on" : "off"}.`);
console.log(`Setting Directory Listing: ${LISTDIRS ? "on" : "off"}.`);


//Directory Mappings
const directories = { };

for (let str of FOLDERS.split("\n"))
{
	let split = str.split(":");
	directories[split[0]] = split[1];
	console.log(`Serving ${split[1]} at ${PORT}/${split[0]}`);
}

//Error Handler
const error = (req, res, code) => {
	res.writeHead(200);
	res.end(code, 'utf-8');
	if (LOGGING) console.log(`Returned Code ${code}`);
};

//Handler:
const handler = (req, res) => {
	
	if (LOGGING) console.log("URL:", req.url);

	let parts = req.url.split("/");
	if (parts[0] == "") parts.shift();

	let location = parts.shift();
	if (!location) return error(req, res, "404");

	let base = directories[location];
	if (!base) return error(req, res, "404");

	let filepath = path.join(location, ...parts);
	
	fs.lstat(filepath, (err, stat) => {
		if (err) return error(req, res, "401");
		
		if (stat.isFile()) {
			return fs.readFile(filepath, (err, data) => {
				if (err && err.code == 'ENOENT') return error(req, res, "404")
				if (err) return error(req, res, "401");
				
				res.writeHead(200);
				res.end(data, 'utf-8');
				if (LOGGING) console.log("Returned File.");
			});
		}
		
		if (stat.isDirectory()) {
			if (!LISTDIRS) return error(req, res, "403");
			
			fs.readdir(filepath, (err, files) => {
				if (err) return error(req, res, "401");
				
				res.writeHead(200);
				res.write(`<a href="${path.join(location, [...parts].splice(0, parts.length-1))}">../</a>`);
					  
				for (let file of files) {
					res.write(`<br/><a href="${path.join(filepath, file)}">${file}</a>`);
				}
				
				res.end();
				
				if (LOGGING) console.log("Returned Directory.");
			});
		}
		
		return error(req, res, "404");
	});
};

//Create http server.
console.log(`Starting HTTP server on port ${PORT}`);

http.createServer(handler).listen(PORT, () => {
	console.log(`HTTP server started.`);
});



