const Express = require('express');
const App = Express();
const Http = require('http').Server(App);
const SocketIo = require('socket.io')(Http);
const NetworkList = require('network-list'); // Odpowiada za szukanie komputerów w sieci

const VIEWS = {
    home: __dirname + '/public/views/index.html', // Ustawienie ścieżki do głownej strony
}

App.enable('trust proxy'); // https://expressjs.com/en/guide/behind-proxies.html

// Ustawienie folderów, aby nie podawać całej ścieki do plików w .html
App.use(Express.static(__dirname + '/public'));
App.use(Express.static(__dirname + '/node_modules'));

App.get('/', (req, res) => res.sendFile(VIEWS.home)); // W momencie wejścia na stronę wysyła idex.html

const IP = '192.168.1'; // Po jakim ip ma szukać komputerów (bez ostatniej wartości)
const DEVICES = []; // Tablica przechowująca wszystkie znalezione sprzęty

Http.listen(80, () => { // Uruchomienie serwera http
    console.log("App listening on port 80!");

    console.log("Scanning local network...");
    NetworkList.scanEach({ip: IP}, (err, obj) => { // Zaczęcie szukanai urządzeń.
        if (obj.alive) { // Jeśli urządzenie działa
            DEVICES.push(obj); // Dodaje urządzenie do tablicy
        }
    });
});

SocketIo.on('connection', socket => { // W momencie kiedy ktoś połączy się ze stroną
    socket.emit("getDevices", DEVICES); // Wysyła wszystkie odnalezione urządzenia do podłączonego klienta
});