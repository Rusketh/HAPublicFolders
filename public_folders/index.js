const fs = require('fs');

fs.readFile("config.json", "utf8", (err, data) => {

	let config;

	if (err || !data)
	{
		console.log("Error reading config file.");
		return;
	}

	try
	{
		config = JSON.parse(config);
	}
	catch(err2)
	{
		console.log("Error parsing config file: " + err2);
		return;
	}

	console.log("CONFIG FILE -> ", config);

});
