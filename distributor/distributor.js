'use strict'
// distributor 생성. 로그 처리 모니터링 예정
var map = {};
class distributor extends require('./server.js') {
    constructor() {
        super("distributor", 9000, ["POST/distributes", "GET/distributes"]);
    }
    // 노드 접속 이벤트
    onCreate(socket) {
        console.log("onCreate", socket.remoteAddress, socket.remotePort);
        this.sendInfo(socket);
    }
    // 노드 접속 해제 이벤트
    onClose(socket){
        var key = socket.remoteAddress + ":" + socket.remotePort;
        console.log("onClose", socket.remoteAddress, socket.remotePort);
        delete map[key];
        this.sendInfo();
    }
    // 노드 정보 등록
    onRead(socket, json) {
        var key = socket.remoteAddress + ":" + socket.remotePort;
        console.log("onRead", socket.remoteAddress, socket.remotePort, json);
        if (json.uri == "/distributes" && json.method == "POST") {
            map[key] = {
                socket: socket
            };
            map[key].info = json.params;
            map[key].info.host = socket.remoteAddress;
            this.sendInfo();
        }
    }
    write(socket, packet) {
        socket.write(JSON.stringify(packet) + '¶');
    }
    // 노드 접속정보 전파
    sendInfo(socket) {
        var packet = {
            uri: "/distributes",
            method: "GET",
            key: 0,
            params: []
        };
        for (var n in map) {
            packet.params.push(map[n].info);
        }
        if (socket) {
            this.write(socket, packet);
        } else {
            for (var n in map) {
                this.write(map[n].socket, packet);
            }
        }
    }
}
new distributor();
