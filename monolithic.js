const http = require('http');
// url 모듈 로드
const url = require('url');
// querystring 모듈 로드
const querystring = require('querystring');

const members = require('./monolithic_members.js');
const goods = require('./monolithic_goods.js');
const purchases = require('./monolithic_purchases.js');

//http서버 만들고 요청처리
var server = http.createServer((req, res) => {
    var method = req.method;
    var uri = url.parse(req.url, true);
    var pathname = uri.pathname;
    if (method === "POST" || method === "PUT") {
        var body = "";

        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            var params;
            if (req.headers['content-type'] == "application/json") {
                params = JSON.parse(body);
            } else {
                params = querystring.parse(body);
            }
            onRequest(res, method, pathname,params);
            });
        } else {
            onRequest(res, method, pathname, uri.query);
        }
    }).listen(8000);

// 요청별로 회원/상품/구매 모듈 분기
function onRequest(res, method, pathname, params) {
    switch (pathname) {
        case "/members":
            members.onRequest(res, method, pathname, params, response);
            break;
        case "/goods":
            goods.onRequest(res, method, pathname, params, response);
            break;
        case "/purchases":
            purchases.onRequest(res, method, pathname, params, response);
            break;
        default:
            res.writeHead(404);
            return res.end();   
    }
}
// http 프로토콜 (200 정상처리)
// json형식 응답
function response(res, packet) {
    res.writeHead(200, { 'Content-Type':
    'application/json' });
    res.end(JSON.stringify(packet));
}