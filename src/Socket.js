import {EventEmitter} from 'events';

// Socket class to construct and provide methods for WebSocket connections.
class Socket {
    constructor(ws = new WebSocket(), ee = new EventEmitter()) {
        this.ws = ws;
        this.ee = ee;

        ws.onmessage = this.message.bind(this);
        ws.onopen = this.open.bind(this);
        ws.onclose = this.close.bind(this);
        ws.onerror = this.error.bind(this);
    };

    // on adds a function as an event consumer/listener.
    on(name, fn) {
        this.ee.on(name, fn);
    };

    // open handles a connection to a websocket.
    open() {
        this.ee.emit('connect');
    };

    // close to handles a disconnection from a websocket.
    close() {
        this.ee.emit('disconnect');
    };
    
    // error handles an error on a websocket.
    error(e) {
        console.log("websocket error: ", e);
    }

    // emit sends a message on a websocket.
    emit(name, data) {
        const message = JSON.stringify({name, data});
        this.ws.send(message);
    }

    // message handles an incoming message and forwards it to an event listener.
    message(e) {
        console.log("Received message from server")
        try {
            const message = JSON.parse(e.data);
            this.ee.emit(message.name, message.data);
        }
        catch(err) {
            this.ee.emit('error', err);
        }
    }
}

export default Socket;