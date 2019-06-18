// will help with formating a table
const Table = require('easy-table')
const { Observable, combineLatest } = require('rxjs');
const { map, throttleTime } = require('rxjs/operators');
// import my observable and a function to calculate the speed
const {myObservable, calculateSpeed} = require('./helpers');
const { getRace } = require('./race');

const race = getRace();

// Return an observable: For each buffer entries, calculateSpeed, return xlocation and car name
const getCar = (name) => myObservable(race, name).pipe(
    map(entries => entries.length > 0 && ({
      speed: calculateSpeed(entries[0], entries[entries.length-1]),
      xLocation: entries[0].xLocation,
      name: entries[0].carName,
    })));

// Cars observables.
const mcQueen$ = getCar('Lightning McQueen');
const king$ = getCar('The King');

const getLeaderBoard = (race) => new Observable(subscriber => {
    // combineLatest : Listen to a group of observable.
    // Maybe this can be done with forkJoin or 
    combineLatest(mcQueen$, king$).subscribe(cars => {
        cars.sort((mcQueen, king) => king.xLocation - mcQueen.xLocation);
        cars = cars.map((car, index) => ({
          position: index + 1,
          carName: car.name,
          leaderGapDistance: (cars[0].xLocation - car.xLocation).toFixed(2),
          leaderGapTime: ((cars[0].xLocation - car.xLocation) / car.speed).toFixed(2)
        }));
        // Send cars
        subscriber.next(cars);
    });
});

const leaderBoard$ = getLeaderBoard(race);

leaderBoard$.subscribe(leaderBoard => {
  const t = new Table()
  leaderBoard.forEach(function(car) {
    t.cell('#', car.position)
    t.cell('Name', car.carName)
    t.cell('Gap Distance', `${car.leaderGapDistance}m`)
    t.cell('Gap Time', `${car.leaderGapTime}ms`)
    t.newRow()
  });
  process.stdout.write(t.toString());
  // clear current the table at next writing
  process.stdout.moveCursor(0, -4)
});

race.start();