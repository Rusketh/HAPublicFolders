//Modules
const fs = require('fs');
const http = require('http');
const path = require('path');

//Config
const PORT = process.env.PORT || 8080; //Math.ceil(8000 + (Math.random() * 1000));

//Load Config:
const config = require("./data/options.json");

const LISTDIRS = config.directory_listing;
const LOGGING = config.request_logging;
const FOLDERS = config.folders;

//console.log("Dumping Config:");
//console.log(config);
//console.log("--------------------------------------------------");


//List settings
console.log(`Setting Request Logging: ${LOGGING ? "on" : "off"}.`);
console.log(`Setting Directory Listing: ${LISTDIRS ? "on" : "off"}.`);


//Directory Mappings
const directories = { directories: { } };

for (let str of FOLDERS)
{
	let split = str.split(":");
	let full_url = split[0]
	let full_path = split[1];

	if (! full_url.match(/([a-zA-z\-_0-9\/\.]+)/)) {
		console.error(`Invalid url path ${url}`);
		continue;
	}

	if (! full_path.match(/([a-zA-z\-_0-9\/\.]+)/)) {
		console.error(`Invalid directory path ${path}`);
		continue;
	}

	let parts = full_url.split("/");
	let base_url = parts.shift();
	let directory = (directories.directories[base_url] || (directories.directories[base_url] = { directories : { } }));

	for (let part in parts) {
		directory = (directory.directories[part] || (directory.directories[part] = { directories : { } }));
	}

	directory.path = full_path;
	console.log(`Serving ${full_path} at :${PORT}/${full_url}`);
}

//console.log(directories);

//Error Handler
const error = (req, res, code, err) => {
	res.writeHead(200);
	res.end(code, 'utf-8');
	
	if (LOGGING) {
		console.log(`Returned Code ${code}`);
		if (err) console.log("Reason:", err);
	}
};

//Handler:
const handler = (req, res) => {
	
	if (LOGGING) console.log("Requesting:", req.url);
	
	let found;
	let location = [ ];
	let directory = directories;
	let parts = req.url.split("/");

	//console.log("---------------------");
	//console.log(req.url);
	//console.log("---------------------");

	while (true) {
		part = parts.shift();

		if (part == null) {
			//console.log("End of Location");
			break;
		}

		if (part == "") {
			//console.log("Skipped bad-char");
			continue;
		}

		if (directory.directories && directory.directories[part]) {
			//console.log("Next Dir", part);
			location.push(part);
			directory = directory.directories[part];
			if (directory.path) found = { location: [...location], parts: [...parts], directory };
			continue;
		}

		break;
	}

	if (found) {
		directory = found.directory;
		location = found.location;
		parts = found.parts;
	}

	//console.log("Directory:", directory.path);
	//console.log("---------------------");
	//console.log("---------------------");

	if (!directory || !directory.path) return error(req, res, "404", "No redirection url found.");
	
	let userpath = path.join(...location, ...parts);
	let filepath = path.join(directory.path, ...parts);

	if (LOGGING) console.log("Resolved Location:", filepath);
	
	fs.lstat(filepath, (err, stat) => {
		if (err) return error(req, res, "401", err);
		
		if (stat.isFile()) {
			return fs.readFile(filepath, (err, data) => {
				if (err && err.code == 'ENOENT') return error(req, res, "404")
				if (err) return error(req, res, "401", err);
				
				res.writeHead(200);
				res.end(data);

				if (LOGGING) console.log("Returned File.");
			});
		}
		
		if (stat.isDirectory()) {
			if (!LISTDIRS) return error(req, res, "403", "Listing disabled.");
			
			return fs.readdir(filepath, (err, files) => {
				if (err) return error(req, res, "401", err);
				
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);

				res.write(`Directory: ${userpath}`);
				
				for (let file of files) {
					res.write(`<br/><a href="/${path.join(userpath, file)}">${file}</a>`);
				}
				
				res.end();

				if (LOGGING) console.log("Returned Directory.");
			});
		}
		
		return error(req, res, "404", "Location not found.");
	});
};

//Create http server.
console.log(`Starting HTTP server on port ${PORT}`);

http.createServer(handler).listen(PORT, () => {
	console.log(`HTTP server started.`);
});



