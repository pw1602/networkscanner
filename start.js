const Express = require('express');
const App = Express();
const Http = require('http').Server(App);
const SocketIo = require('socket.io')(Http);
const NetworkList = require('network-list');

const VIEWS = {
    home: __dirname + '/public/views/index.html',
}

App.enable('trust proxy');
App.use(Express.static(__dirname + '/public'));
App.use(Express.static(__dirname + '/node_modules'));

App.get('/', (req, res) => res.sendFile(VIEWS.home));

const IP = '192.168.1';
const DEVICES = [];

Http.listen(80, () => {
    console.log("App listening on port 80!");

    console.log("Scanning local network...");
    NetworkList.scanEach({ip: IP}, (err, obj) => {
        if (obj.alive) {
            DEVICES.push(obj);
        }
    });
});

SocketIo.on('connection', socket => {
    socket.emit("getDevices", DEVICES);
});