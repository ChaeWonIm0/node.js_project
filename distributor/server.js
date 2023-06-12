// 스트릭트 모드
'use strict';
const net = require('net');
const tcpClient = require('./client.js');

class tcpServer {
    constructor(name, port, urls) {
        this.context = {
            port: port,
            name: name,
            urls: urls
        }
        this.merge = {};
        this.server = net.createServer((socket) => {
            this.onCreate(socket);
            socket.on('error', (exception) => {
                this.onClose(socket);
            });
            socket.on('close', () => {
                this.onClose(socket);
            });
            socket.on('data', (data) => {
                var key = socket.remoteAddress + ":" + socket.remotePort;
                var sz = this.merge[key] ? this.merge[key] + data.toString() :
                                            data.toString();
                var arr = sz.split('¶');
                for (var n in arr) {
                    if (sz.charAt(sz.length - 1) != '¶' && n == arr.length -1) {
                        this.merge[key] = arr[n];
                        break;
                    } else if (arr[n] == "") {
                        break;
                    } else {
                        this.onRead(socket, JSON.parse(arr[n]));
                    }
                }
            });
        });
        // sever 객체 에러처리
        this.server.on('error', (err) => {
            console.log(err);
        });
        this.server.listen(port, () => {
            console.log('listen', this.server.address());
        });
    }
    onCreate(socket) {
        console.log("onCreate", socket.remoteAddress, socket.remotePort);
    }
    onClose(socket) {
        console.log("onClose", socket.remoteAddress, socket.remotePort);
    }

// distributor 접속 함수
connectToDistributor(host, port, onNoti) {
    // 전달할 packet 정의
    var packet = {
        uri: "/distributes",
        method: "POST",
        key: 0,
        params: this.context
    };
    var isConnectedDistributor = false;
    this.clientDistributor = new tcpClient(
        host
        , port
        , (options) => {
            isConnectedDistributor = true;
            this.clientDistributor.write(packet);
        }
        , (options, data) => { onNoti(data); }
        , (options) => { isConnectedDistributor = false;}
        , (options) => { isConnectedDistributor = false;}
        );
        // 주기적인 접속 시도
        setInterval(() => {
            if (isConnectedDistributor != true) {
                this.clientDistributor.connect();
            }
        }, 3000);
    }
}
module.exports = tcpServer;