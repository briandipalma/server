/** @module server/lib/server */

"use strict";

var staticServer,
	http = require("http"),
	listen = require("in-a-storm"),
	program = require("commander"),
	nodeStatic = require("node-static"),
	serverOptions = {
		headers: { "Cache-Control": "no-cache, must-revalidate" }
	};

/**
 * Request listener passed into node's http server.
 * 
 * @private
 * @param {http.ClientRequest} request - Client request.
 * @param {http.ServerResponse} response - Server response.
 */
function clientRequestHandler(request, response) {
	request.addListener("end", requestEndedListener).resume();
	
	function requestEndedListener() {
		staticServer.serve(request, response);
	}
}

/**
 * Called once the web server is bound to a port.
 * 
 * @private
 * @param {*} error - An error that prevented port binding.
 * @param {number} serverPort - Port web server is bound to.
 */
function webServerBoundToPort(error, serverPort) {
	if(error) {
		console.error(error);
	} else {
		staticServer = new nodeStatic.Server(".", serverOptions);
		
		console.info("Server available at http://localhost:" + serverPort);		
	}
}

/**
 * Function which allows a user to configure and launch a server.
 * 
 * @alias module:server/lib/server
 * @param {Array} serverArguments - Arguments used to configure server.
 */
function parseArgumentsAndLaunchServer(serverArguments) {
	program.
		version("0.0.0").
		option("-p, --port [port]", "Server port", process.env.PORT || 8080).
		parse(serverArguments);

	var webServer = http.createServer(clientRequestHandler);
	
	listen(webServer, program.port, webServerBoundToPort);
}

module.exports = parseArgumentsAndLaunchServer;
