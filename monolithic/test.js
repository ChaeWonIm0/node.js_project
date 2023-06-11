const http = require('http');
var options = {
    host : '127.0.0.1',
    port : 80,
    headers: {
        'Content-Type' : 'application/json'
    }
};

function request(cb, params) {
    var req = http.request(options, (res) => {
        var data = "";
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(options, data);
            cb();
        });
    });
    if (params) {
        req.write(JSON.stringify(params));
    }
    req.end();
}
// 상품관리 api 테스트
function goods(callback) {
    goods_post(() => {
        goods_get(() => {
            goods_delete(callback);
        });
    });
    function goods_post(cb) {
        options.method = "POST";
        options.path = "/goods";
        request(cb, {
            name: "some goods",
            category : "phone",
            price : 9999,
            description: "samsung"
        });
    }
    function goods_get(cb) {
        options.method = "GET";
        options.path = "/goods";
        request(cb);
    }
    function goods_delete(cb) {
        options.method = "DELETE";
        options.path = "/goods?id=1";
        request(cb);
    }
}    
// 회원정보 api 테스트
function members(callback) {
    members_delete(() => {
        members_post(() => {
            members_get(callback);
        });
    });
    function members_post(cb) {
        options.method = "POST";
        options.path = "/members";
        request(cb, {
            username: "AI",
            password : "1234",
            passwordConfirm: "1234"
        });
    }
    function members_get(cb) {
        options.method = "GET";
        options.path = "/members?username=AI&password=1234";
        request(cb);
    }
    function members_delete(cb) {
        options.method = "DELETE";
        options.path = "/members?username=AI";
        request(cb);
    }
}    
// 구매내역 api 테스트
function purchases(callback) {
    purchases_post(() => {
        purchases_get(() => {
            callback();
        });
    });
    function purchases_post(cb) {
        options.method = "POST";
        options.path = "/purchases";
        request(cb, {
            userid: 1,
            goodsid : 1,
        });
    }
    function purchases_get(cb) {
        options.method = "GET";
        options.path = "/purchases?userid=1";
        request(cb);
    }
}
console.log("******************members******************");
members(() => {
    console.log("******************goods******************");
    goods(() => {
        console.log("******************purchases******************");
        purchases(() => {
            console.log("done");
        });
    });
});