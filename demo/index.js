const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer();
const Corrosion = require('../');
const proxy = new Corrosion({
    codec: 'xor',
    prefix: '/c/',
    forceHttps: true
});

proxy.bundleScripts();

server.on('request', (request, response) => {
    if (request.url.startsWith(proxy.prefix)) return proxy.request(request, response);
    response.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}).on('upgrade', (clientRequest, clientSocket, clientHead) => proxy.upgrade(clientRequest, clientSocket, clientHead)).listen(process.env.PORT || 7070); // we have to listen at a higher port because heroku