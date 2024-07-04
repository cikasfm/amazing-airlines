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
    this.fareMultiplier = {
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
    this.loyaltyPointsBonusMultiplier = 0.8;
  }

  /**
   * Checks if Business Class identifier is supported
   * 
   * @param {String} bookingClass Booking Class
   * @returns true if Booking Class is supported, false otherwise
   */
  isValidClass(bookingClass) {
    return this.fareMultiplier.hasOwnProperty(bookingClass);
  }

  /**
   * Calculates adjusted fare price
   * 
   * @param {Object} flight flight details
   * @param bookingClass Booking class
   * 
   * @returns adjusted fare rate
   */
  adjustFare(flight, bookingClass, isLoyaltyMember = false){

    let adjMultiplier = 1.0;

    let availability = flight.tickets_sold * 100 / flight.capacity;

    if ( availability < this.lowDemand.maxAvailabilityPct ) {
      adjMultiplier = this.lowDemand.multiplier;
    }
    else if ( availability > this.highDemand.minAvailabilityPct ) {
      adjMultiplier = this.highDemand.multiplier;
    }

    /**
     * TODO : add historical multiplier
     * In order to add historical data multiplier, we need to know
     * whether this flight was historically popular
     * 
     * That should be pre-calculated and saved as flight metadata in the database.
     */

    // loyalty multiplier
    if ( isLoyaltyMember && flight.points_bonus_multiplier ) {
      // TODO : what formula should be used here?
      // multiply previous value? or replace previous value?
      adjMultiplier *= this.loyaltyPointsBonusMultiplier;
    }

    let fare = flight.base_cost * this.fareMultiplier[bookingClass] * adjMultiplier;

    return fare;
  }
}

module.exports = { FareAdjusterService };
