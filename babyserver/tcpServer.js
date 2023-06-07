// net 모듈 로드
var net = require('net');

// 클라이언트 접속시 호출되는 콜백함수
var server = net.createServer((socket) => {
    socket.end("hello world");
});

// 에러 이벤트 처리
server.on('error',(err) => {
    console.log(err);
});

// 포트 할당 : 9000
server.listen(9000, () => {
    console.log('listen', server.address());
});