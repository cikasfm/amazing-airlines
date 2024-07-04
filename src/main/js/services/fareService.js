const { FareAdjusterService } = require('./fareAdjusterService');

// Select Flight SQL statement
const selectFlightSQL = `SELECT * FROM flights WHERE flight_id = ?`;

class FareService {

  constructor({ db }) {
    this.db = db;
    this.selectFlight = this.db.prepare( selectFlightSQL );
    this.fareAdjusterService = new FareAdjusterService();
  }

  /**
   * Get the fare for a flight and booking class
   *
   * @param flightId Flight ID
   * @param bookingClass Booking class
   * @returns Promise that resolves to the fare
   */
  getFare(flightId, bookingClass) {
    return new Promise((resolve, reject) => {

      // Check if the booking class is valid
      if (!this.fareAdjusterService.isValidClass(bookingClass)) {
        reject("Invalid booking class");
      }

      if (isNaN(flightId)) { // validate input before using in query
        reject(`Invalid Argument: flight_id=${flightId} is not a valid number`);
      }

      this.selectFlight.get( [ flightId ], (err, flighResult) => {
        if (err) {
          reject(err);
        }
        if (flighResult == null) {
          reject(new Error(`Flight with id=${flightId} not found`));
        }
        
        let fare = this.fareAdjusterService.adjustFare(flighResult, bookingClass);

        resolve(fare);
      });
    });
  }
}

module.exports = { FareService };
