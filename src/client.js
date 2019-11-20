'use strict'

const net = require('net');
const url = require('url');

// Client can read/write messages from a TCP server
class Client {
    // init initializes the Client
    init() {
        this.u = url.parse("tcp://" + process.argv[1], false, false)
        this.socket = new net.Socket()
        this.socket.connect(this.u.port, this.u.hostname, function() {});
        this.socket.on('close', function() {
            setTimeout(this.reconnect, 500)
        })
        return this
    }

    reconnect(){
        try{
            this.socket = new net.Socket();
            this.socket.connect(this.u.port, this.u.hostname, function() {});
            this.socket.on('close', function() {
                setTimeout(this.reconnect, 500)
            })
        }catch(e){
            process.exit()
        }
    }

    // write writes an event to the server
    write(targetID, eventName, payload) {
        try{
            let data = {name: eventName, targetID: targetID}
            if (typeof payload !== "undefined") Object.assign(data, payload)
            if (!this.socket.destroyed && !this.socket.pending){
                this.socket.write(JSON.stringify(data) + "\n")
            }
        }catch (e) {
            console.log("I caught an error: " + e.message);
        }
    }
}

module.exports = new Client()
