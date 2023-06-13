'use strict';
// microservice_members와 동일한 로직 적용
const business = require('../monolithic/monolithic_purchases.js');
class purchases extends require('./server.js') {
    constructor() {
        super("purchases"
        , process.argv[2] ? Number(process.argv[2]) : 9030
        , ["POST/purchases", "GET/purchases"]
        );
        this.connectToDistributor("127.0.0.1", 9000, (data) => {
            console.log("Distributor Notification", data);
        });
    }
    // 비즈니스 로직 호출
    onRead(socket, data) {
        console.log("onRead", socket.remoteAddress, socket.remotePort, data);
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet)=>{
            socket.write(JSON.stringify(packet) + '¶');
        });
    }
}
new purchases();