const {fromEvent} = require('rxjs');
const { filter, throttleTime, buffer } = require('rxjs/operators')

// Simple function to calculate speed between two emitted values.
const calculateSpeed = (from, to) => {
    // Speed = distance / time (m/s)
    const distance = to.xLocation - from.xLocation;
    // divided by 1000 because time is in ms. 
    const time = (to.time - from.time) / 1000; 
    // toFixed(2) to format the speed value.
    return (distance / time).toFixed(2);
}

// Create an observable that listen to each 'data' event of race.
// For each 'data' event, i will filter data by car name and buffer entries every 200ms.
const data$ = (race) => fromEvent(race, 'data');
const myObservable = (race, carName) => data$(race)
    .pipe(
        filter(data => data.carName === carName),
        // Keep values of data in a buffer every 200ms before emit to calculate speed
        buffer(data$(race).pipe(throttleTime(200))),
    );

module.exports = {calculateSpeed, myObservable, data$};