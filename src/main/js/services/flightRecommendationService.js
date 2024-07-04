const { openDb } = require("../db/dbUtil");

class FlightRecommendationService {
  origin;
  destination;
  departureDate;
  bookingClass;
  partySize;
  budget;
  loyaltyId;
  recommendedFlights;

  constructor({ preferences, db }) {
    const {
      origin,
      destination,
      departureDate,
      bookingClass,
      partySize,
      budget,
      loyaltyId,
    } = preferences;

    // User preferences
    this.origin = origin;
    this.destination = destination ?? null;
    this.departureDate = departureDate ?? null;
    this.bookingClass = bookingClass ?? "economy";
    this.partySize = partySize ?? 1;
    this.budget = budget ?? null;
    this.loyaltyId = loyaltyId ?? null;
    this.recommendedFlights = new Map();
  }

  /**
   * Get recommended flights based on user preferences
   *
   * @param numResults Number of recommended flights to return
   * @returns Promise that resolves to a map of recommended flights and their scores
   */
  getRecommendedFlights(numResults = 15) {
    return new Promise((resolve, reject) => {
      let db = openDb();
      let sql = this.buildFilteredQuery();

      db.all(sql, async (err, rows) => {
        if (err) {
          reject(err);
        }

        // Add recommended flights to map with score of 0
        for (let row of rows) {
          let flight = row;
          this.recommendedFlights.set(flight, 0);
        }

        // Update flight scores based on historical popularity
        await this.scoreHistoricalPopularity(db);

        // Sort recommended flights by score
        let sortedFlights = Array.from(this.recommendedFlights)
          .sort((a, b) => {
            return b[1] - a[1];
          })
          .slice(0, numResults);

        // Return as a map
        resolve(new Map(sortedFlights));
      });
    });
  }

  /**
   * Build SQL query based on user preferences
   *
   * @returns SQL query string
   */
  buildFilteredQuery() {
    let sql = `SELECT * FROM flights WHERE flight_status="upcoming" AND departure_airport="${this.origin}" AND availability >= ${this.partySize}`;

    // Add optional filters
    if (this.destination) {
      sql += ` AND arrival_airport="${this.destination}"`;
    }

    if (this.departureDate) {
      sql += ` AND departure_datetime LIKE "${this.departureDate} %"`;
    }

    if (this.bookingClass) {
      let bookingClassAvailability = this.bookingClass + "_availability";
      sql += ` AND ${bookingClassAvailability} >= ${this.partySize}`;
    }

    if (this.budget) {
      sql += ` AND base_cost <= ${this.budget}`;
    }

    return sql;
  }

  /**
   * Update flight scores based on historical popularity of destinations
   *
   * @param db Database connection
   * @returns Promise that resolves when flight scores are updated
   */
  scoreHistoricalPopularity(db) {
    return new Promise((resolve, reject) => {
      let month = this.departureDate?.split("-")[1];
      if (!month) {
        // Get current month
        month = new Date().getMonth() + 1 + "";
        month = month.padStart(2, "0");
      }

      let sql = `SELECT * FROM flights WHERE flight_status="completed" AND departure_airport="${this.origin}" AND departure_datetime LIKE "%-${month}-%"`;

      // Get all past flights from origin airport in current month
      db.all(sql, (err, pastFlights) => {
        if (err) {
          reject(err);
        }

        // Count number of tickets sold to each destination
        let destinationCounter = new Map();
        for (let pastFlight of pastFlights) {
          let flight = pastFlight;
          let destination = flight.arrival_airport;
          let ticketsSold = flight.tickets_sold;
          let count = destinationCounter.get(destination) ?? 0;
          destinationCounter.set(destination, count + ticketsSold);
        }

        // Update score of recommended flights based on number of past flights
        for (let [flight, score] of this.recommendedFlights) {
          let destination = flight.arrival_airport;
          let count = destinationCounter.get(destination) ?? 0;
          this.recommendedFlights.set(flight, score + count);
        }

        resolve();
      });
    });
  }
}

module.exports = { FlightRecommendationService };
