// Select Flight SQL statement
const selectFlightSQL = `SELECT * FROM flights WHERE flight_id = ?`

/**
 * Adjusts the flight fare based on flight availability & demand and booking class
 * 
 * - The fare is higher for higher booking classes (e.g. first class is more expensive than business, which is more expensive than economy).
 * 
 * The airline would like to support dynamic pricing based on the following criteria for all customers:
 * 
 * - The fare should be lower for flights that are in low demand (e.g. flights that are almost empty).
 * - The fare should be higher for flights that are in high demand (e.g. flights that are almost sold out).
 * - The fare should be higher for flights that have historically been popular for the given month (e.g. flights that have been sold out in the past).
 * 
 * If the user is a loyalty program member, the airline would like to support the following additional criteria:
 * 
 * - The fare should be lower for flights that have bonus point multiplier promotions.
 */
class FareAdjusterService {

  constructor() {
    // A map of booking classes and their fare multipliers
    this.fare_multiplier = {
      economy: 1.0,
      business: 1.5,
      first: 2.0,
    };

    // TODO : load these from DB?
    this.lowDemand = {
      maxAvailabilityPct: 20,
      multiplier: 0.75,
    }
    this.highDemand = {
      minAvailabilityPct: 80,
      multiplier: 1.25,
    },
    this.historicallyPopularMultiplier = 1.25;
  }

  /**
   * Checks if Business Class identifier is supported
   * 
   * @param {String} bookingClass Booking Class
   * @returns true if Booking Class is supported, false otherwise
   */
  isValidClass(bookingClass) {
    return this.fare_multiplier.hasOwnProperty(bookingClass);
  }

  /**
   * Calculates adjusted fare price
   * 
   * @param {Object} flight flight details
   * @param bookingClass Booking class
   * 
   * @returns adjusted fare rate
   */
  adjustFare({ base_cost, capacity, tickets_sold }, bookingClass){

    let demand_multiplier = 1.0;

    let availability = tickets_sold * 100 / capacity;

    if ( availability < this.lowDemand.maxAvailabilityPct ) {
      demand_multiplier = this.lowDemand.multiplier;
    }
    else if ( availability > this.highDemand.minAvailabilityPct ) {
      demand_multiplier = this.highDemand.multiplier;
    }

    let fare = base_cost * this.fare_multiplier[bookingClass] * demand_multiplier;

    return fare;
  }
}

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
