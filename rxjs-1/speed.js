const { getRace } = require('./race');
const {fromEvent} = require('rxjs');
const { filter, map, throttleTime, bufferCount, buffer, bufferTime } = require('rxjs/operators')

const {myObservable, calculateSpeed} = require('./helpers');

const race = getRace();
const carName = 'Lightning McQueen';

// calculate speed for each buffer entries
const getCarSpeed = (race, carName) => myObservable(race, carName)
    .pipe(
        map(buff => buff.length > 0 ? calculateSpeed(buff[0], buff[buff.length-1]) : 0),
    );

const speed$ = getCarSpeed(race, carName);

// adding `\r` allows to overwrite the message in the same line
speed$.subscribe(speed => process.stdout.write(`Speed: ${speed}m/s\r`));

race.start();  