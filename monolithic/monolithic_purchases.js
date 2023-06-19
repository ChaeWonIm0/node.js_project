const mysql = require('mysql');

const conn = {
    host : 'localhost',
    user : 'root',
    password : '0000',
    database : 'monolithic'
};
// 구매관리 모듈
exports.onRequest = function(res, method, pathname, params, cb) {
    switch(method) {
        case "POST":
            return register(method, pathname, params, (response) => {
                process.nextTick(cb, res, response); });
        case "GET":
            return inquiry(method, pathname, params, (response) => {
                process.nextTick(cb, res, response); });
        default:
            return process.nextTick(cb, res, null);
    }
}
// 구매 등록 기능
function register(method, pathname, params, cb) {
    if (typeof cb !== 'function') {
        console.error('cb is not function1');
        return;
    }
    var response ={
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };
    if (params.userid == null || params.goodsid== null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
        } else {
            var connection = mysql.createConnection(conn);
            connection.connect();
            connection.query("INSERT INTO purchases(userid, goodsid) values(?, ?)"
            , [params.userid, params.goodsid]
            , (error, results, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
            });
        connection.end();
    }
}
// inquiry로 구매내역 조회 기능
function inquiry(method, pathname, params, cb) {
    if (typeof cb !== 'function') {
        console.error('cb is not function2');
        return;
    }
    var response = {
        key : params.key,
        errorcode : 0,
        errormessage : "success"
    };

    if (params.userid == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("select id, goodsid, date from purchases where userid = ?"
        , [params.userid]
        , (error, results, fields) => {
        if (error) {
            response.errorcode = 1;
            response.errormessage = error;
        } else {
            response.results = results;
        }
        cb(response);
    });
    connection.end();
    }
}