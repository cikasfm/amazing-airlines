const {
  FlightRecommendationService,
} = require("./services/flightRecommendationService");
const { FareService } = require("./services/fareService");

// Sample user preferences
const GREEN = "\x1b[0;32m";
const END = "\x1b[0m";

const sampleUserPreferences = {
  origin: "JFK",
  destination: null,
  departureDate: null,
  bookingClass: "economy",
  partySize: 1,
  budget: null,
  loyaltyId: null,
};

class Runner {
  constructor() {}

  async run() {
    // Create a flight recommendation service
    let frs = new FlightRecommendationService(sampleUserPreferences);
    let recommendedFlights = await frs.getRecommendedFlights();

    // Print recommended flights
    this.printRecommendedFlights(recommendedFlights);

    // Print the results of the fare service
    this.printFareServiceResults(
      recommendedFlights,
      sampleUserPreferences.bookingClass
    );
  }

  printRecommendedFlights(recommendedFlights) {
    console.log("=== Recommended Flights ===\n");
    for (let [flight, score] of recommendedFlights) {
      console.log(
        `${flight.departure_datetime}    ${flight.flight_number}    ${flight.departure_airport}   ${flight.arrival_airport}    ${GREEN}Rating:  ${score}${END}`
      );
    }
    console.log("\n=== End of Recommended Flights ===\n");
  }

  async printFareServiceResults(recommendedFlights, bookingClass) {
    console.log("\n=== Fare Service Results ===\n");
    let fareService = new FareService();
    for (let [flight, _] of recommendedFlights) {
      let fare = await fareService.getFare(flight.flight_id, bookingClass);
      console.log(
        `Fare for flight id ${flight.flight_id} and booking class ${bookingClass}: ${GREEN}$${fare}${END}\n`
      );
    }

    console.log("\n=== End of Fare Service Results ===");
  }
}

let runner = new Runner();
runner.run();
