'use strict';

const COLLAPSE_DIV_PREFIX = 'Collapse_';

Io.on('getDevices', (devices) => {
    const tmp = $('#computers');
    tmp.empty();

    devices.forEach((device, index) => {
        device.index = index;
        $('#computers').append(getListElement(device));
    });
});

function getListElement(value) {
    return `<li id="${value.index}" title="${value.hostname}" class="list-group-item" data-toggle="collapse" data-target="#${COLLAPSE_DIV_PREFIX + value.index}" aria-expanded="false" aria-controls="${COLLAPSE_DIV_PREFIX + value.index}">${value.hostname} ${getBadge(value)}</li>` + getCollapse(value);
}

function getBadge(value) {
    return `<span class="float-right badge badge-light">${value.ip}</span>`;
}

function getCollapse(value) {
    return `<div id="${COLLAPSE_DIV_PREFIX + value.index}" title="${value.hostname}" class="collapse bg-light text-dark"><span id="logs"></span><br/><span id="live">${getCollapseText(value)}</span></div>`;
}

function getCollapseText(value) {
    return `Mac: ${value.mac}, Vendor: ${value.vendor}`;
}