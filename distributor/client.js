'use strict'
const net = require('net');
class tcpClient {
    // 생성자 선언
    constructor(host, port, onCreate, onRead, onEnd, onError) {
        this.options = {
            host : host,
            port: port
        };
        this.onCreate = onCreate;
        this.onRead = onRead;
        this.onEnd = onEnd;
        this.onError = onError;
    }
    connect() {
        this.client = net.connect(this.options, () => {
            if (this.onCreate) 
                this.onCreate(this.options);
        });
        this.client.on('data', (data) => {
            var sz = this.merge ? this.merge + data.toString() : data.toString();
            var arr = sz.split('¶');
            for (var n in arr) {
                if (sz.charAt(sz.length -1) != '¶' && n == arr.length -1) {
                    this.merge = arr[n];
                    break;
                } else if (arr[n] ==""){
                    break;
                } else {
                    this.onRead(this.options, JSON.parse(arr[n]));
                }
            }
        });
        // 접속종료
        this.client.on('close', () => {
            if (this.onEnd)
                this.onEnd(this.options);
        });
        // error 처리
        this.client.on('error', (err) => {
            if(this.onError)
                this.onError(this.options, err);
        });
    }
    // data packet
    write(packet) {
        this.client.write(JSON.stringify(packet) + '¶');
    }
}
// exports 선언
module.exports = tcpClient;