'use strict'
// 비즈니스 logic 참조
const business = require('../monolithic/monolithic_goods');
class goods extends require('./server.js') {
    constructor() {
        super("goods"
        // 기본 포트정보 9010으로 부모클래스 생성자 호출
        , process.argv[2] ? Number(process.argv[2]) : 9010
        , ["POST/goods", "GET/goods", "DELETE/goods"]
        );
        //호스트, 포트정보로 distributor 접속    
        this.connectToDistributor("127.0.0.1", 9000, (data) => {
            console.log("Distributor Notification", data);
        });
    }
    // onRead함수 - 비즈니스 로직 호출 - 응답 패킷 전송
    onRead(socket, data) {
        console.log("onRead", socket.remoteAddress, socket.remotePort, data);
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');
        });
    }    
}
new goods();