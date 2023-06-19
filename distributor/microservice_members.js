'use strict';
// microservice_goods와 동일한 로직 적용
const business = require('../monolithic/monolithic_members.js');
class members extends require('./server.js') {
    constructor() {
        super("members"
        , process.argv[2] ? Number(process.argv[2]) : 9020
        , ["POST/members", "GET/members", "DELETE/members"]
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
new members();