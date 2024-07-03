const { openDb } = require("../db/dbUtil");

class FareService {
  /**
   * Get the fare for a flight and booking class
   *
   * @param flightId Flight ID
   * @param bookingClass Booking class
   * @returns Promise that resolves to the fare
   */
  getFare(flightId, bookingClass) {
    return new Promise((resolve, reject) => {
      // A map of booking classes and their fare multipliers
      const fare_multiplier = {
        economy: 1.0,
        business: 1.5,
        first: 2.0,
      };

      // Check if the booking class is valid
      if (!fare_multiplier.hasOwnProperty(bookingClass)) {
        reject("Invalid booking class");
      }

      // Get flight data
      const db = openDb();
      let sql = `SELECT * FROM flights WHERE flight_id=${flightId}`;
      db.get(sql, (err, flighResult) => {
        if (err) {
          reject(err);
        }
        let flight = flighResult;
        let fare = flight.base_cost * fare_multiplier[bookingClass];

        resolve(fare);
      });
    });
  }
}

module.exports = { FareService };
