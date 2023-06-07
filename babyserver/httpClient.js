var http = requre('http');

var options = {
    host : '127.0.0.1',
    port : 9999,
    path : "/"
};

var req = http.request(options, (res) => {
    var data = "";
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(data);
    });
});
req.end();