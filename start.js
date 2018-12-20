const Express = require('express');
const App = Express();
const Http = require('http').Server(App);
const SocketIo = require('socket.io')(Http);
const NetworkList = require('network-list'); // Odpowiada za szukanie komputerów w sieci
const Net = require('net'), Socket = Net.Socket; // Odpowiada za skanowanie otwartych portów

const VIEWS = {
    home: __dirname + '/public/views/index.html', // Ustawienie ścieżki do głownej strony
}

App.enable('trust proxy'); // https://expressjs.com/en/guide/behind-proxies.html

// Ustawienie folderów, aby nie podawać całej ścieki do plików w .html
App.use(Express.static(__dirname + '/public'));
App.use(Express.static(__dirname + '/node_modules'));

App.get('/', (req, res) => res.sendFile(VIEWS.home)); // W momencie wejścia na stronę wysyła idex.html

const IP = '192.168.1'; // Po jakim ip ma szukać komputerów (bez ostatniej wartości)
const FIRST_PORT = 0;
const LAST_PORT = 1000;
const DEVICES = []; // Tablica przechowująca wszystkie znalezione sprzęty

Http.listen(80, () => { // Uruchomienie serwera http
    console.log("App listening on port 80!");

    console.log("Scanning local network...");
    NetworkList.scanEach({ip: IP}, (err, obj) => { // Zaczęcie szukania urządzeń.
		if (obj.alive) { // Jeśli urządzenie działa
			obj.ports = []; // Dodaje pustą zmienną, która ma być tablicą
			startScanningPorts(obj);
        }
	});
});

SocketIo.on('connection', socket => { // W momencie kiedy ktoś połączy się ze stroną
    socket.emit("getDevices", DEVICES); // Wysyła wszystkie odnalezione urządzenia do podłączonego klienta
}); 

function startScanningPorts(obj) { // Odwołuje się do zmiennej "obj"
	for (let port = FIRST_PORT; port <= LAST_PORT; port++) { // Pętla rozpoczyna się od 0 do 1000
		checkPort(port, obj.ip, function(error, status, host, port) { // Zaczyna sprawdzanie portu i ip
			if (status == "open") { // Jeśli port otwarty
				obj.ports.push({status: status, host: host, port: port}); // Dodaje port do tablicy danego urządzenia
			}
		});
	}

	DEVICES.push(obj); // Dodaje urządzenie do tablicy
}

function checkPort(port, host, callback) { 
    let socket = new Socket(), status = null; 

    socket.on('connect', function() {
		status = 'open';
		socket.end();
	}); 

	socket.setTimeout(1500); 
	
    socket.on('timeout', function() {
		status = 'closed';
		socket.destroy();
	}); 

	socket.on('error', function(exception) {
		status = 'closed';
	}); 

    socket.on('close', function(exception) {
		callback(null, status,host,port);
	}); 

    socket.connect(port, host); 
} 