// net 모듈
var net = require('net');
// 서버정보 선언
var options = {
    port: 9000,
    host: "127.0.0.1"
};

// connect 함수 1번파라미터로 입력, 접속
var client = net.connect(options, () => {
    console.log("connected");
});
// 데이터 수신/접속 종료시 이벤트 해결
client.on('data', (data) => {
    console.log(data.toString());
});
// disconnected 출력
client.on('end', () => {
    console.log("disconnected");
});