const http = require("http");

var server = http.createServer((req, res) => {
    res.end("server open");
});
server.listen(9999);