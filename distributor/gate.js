//HTTP 게이트웨이 생성
const http = require('http');
const url = require('url');
const querystring = require('querystring');

var server = http.createServer((req, res) => {
    var method = req.method;
    var uri = url.parse(req.url, true);
    var pathname = uri.pathname;
    if (method === "POST" || METHOD === "put") {
        var body = "";
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            var params;
            // 헤더가 application/json일 경우 JSON 파싱
            if (req.headers['content-type'] == "application/json"){
                params = JSON.parse(body);
            } else {
                // 그외의 경우 querystring 파싱
                params = querystring.parse(body);
            }
            onRequest(res, method, pathname, parms);
        });        
    } else {
        onRequest(res, method, pathname, uri.query);
    }
}).listen(8000, () => {
    console.log('listen', server.address());
});
function onRequest(res, method, pathname, params){
    
}