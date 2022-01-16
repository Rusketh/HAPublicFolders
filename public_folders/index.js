//Modules
const fs = require('fs');
const http = require('http');
const path = require('path');

//Config
const PORT = process.env.PORT;
const FOLDERS = process.env.FOLDERS;

//Directory Mappings
const directories = { };

for (let str of FOLDERS.split("\n"))
{
	let split = str.split(":");
	directories[split[0]] = split[1];
}

//Error Handler
const error = (req, res, code) => {
	res.writeHead(200);
    res.end(code, 'utf-8');
};

//Handler:
const handler = (req, res) => {
	
	let parts = path.sep(request.url).shift();

	let location = parts[0];
	if (!location) return error(req, res, 404);

	let base = directories[location];
	if (!base) return error(req, res, 404);

	let path = path.join(location, ...parts);

    fs.readFile(path, (err, data) => {
        if (err && err.code == 'ENOENT') return error(req, res, 404)
  		if (err) return error(req, res, 404);
       
        res.writeHead(200);
        res.end(content, 'utf-8');
    });
};

//Create http server.
http.createServer(handler).listen(PORT, () => {
	console.log(`Starting public folders service on ${PORT}`);
});



