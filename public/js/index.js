'use strict';

const COLLAPSE_DIV_PREFIX = 'Collapse_';

Io.on('getDevices', (devices) => { // Otrzymanie informacji od serwera z urządzeniami
    const tmp = $('#computers');
	tmp.empty(); // Wyczyszczenie tabeli urządzeń na stronie

    devices.forEach((device, index) => { // Dla każdego urządzenia
        device.index = index;
        $('#computers').append(getListElement(device)); // Dodanie urządzenia do tabeli
    });
});

function getListElement(value) { // Ustawienia elementu dodawanego do listy
    return `<li id="${value.index}" title="${value.hostname}" class="list-group-item" data-toggle="collapse" data-target="#${COLLAPSE_DIV_PREFIX + value.index}" aria-expanded="false" aria-controls="${COLLAPSE_DIV_PREFIX + value.index}">${value.hostname} ${getBadge(value)}</li>` + getCollapse(value);
}

function getBadge(value) { // Ustawienia badge
    return `<span class="float-right badge badge-light">${value.ip}</span>`;
}

function getCollapse(value) { // Ustawienia elementu na stronie, który po kliknięciu w urządzenie na lisćie będzie się pokazywał
    return `<div id="${COLLAPSE_DIV_PREFIX + value.index}" title="${value.hostname}" class="collapse bg-light text-dark"><span id="logs"></span><br/><span id="live">${getCollapseText(value)}</span></div>`;
}

function getCollapseText(value) {
	let openPorts = "";

	value.ports.forEach(port => {
		openPorts += port.port + ", ";
	});
    return `Mac: ${value.mac}, Vendor: ${value.vendor}, Otwarte Porty: ${openPorts}`;
}