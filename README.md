[![Node.js CI](https://github.com/cikasfm/amazing-airlines/actions/workflows/node.js.yml/badge.svg)](https://github.com/cikasfm/amazing-airlines/actions/workflows/node.js.yml)

# Task List

You may do these tasks in any order, but take note that they are listed in the order your team has prioritized completing them.

Reminder that you are NOT expected to complete all tasks. You are expected to write clean, readable code. Remember to add comments explaining what you were working on if you run out of time in the middle of a task.


## Task 1

A junior engineer is working on updating Amazing Airlines' basic flight recommendation feature to make smarter recommendations based on flight and user data. The frontend calls the function anytime a user visits the flight recommendation page, and again if the user performs a search on the page.

The feature should recommend flights based on the following criteria:

- Basic user preferences provided by the user during a search (origin, destination, departure date, booking class, party size, budget). Flights that do not meet basic user preferences should be filtered out.
- Flight destinations that have been historically popular for the given origin, based on the number of tickets sold for each destination.

The junior engineer has implemented a scoring and ranking algorithm that takes the criteria above into account and scores flights based on the number of criteria met. The flights are sorted by score and the top k-flights are returned to the user.

The flight recommendation feature is awaiting your review in `flightRecommendationService.js`. Please provide both overall and any line-specific feedback you have for the junior engineer in `code_review.txt`.

NOTE: We have provided a small data sample for testing in `airline_reservations_data.db`. You may optionally download a larger version of the database here:

https://storage.googleapis.com/byteboard-static/airline_reservations_data.db

Please make sure to remove any optionally downloaded data from your code before submitting.


## Task 2

Amazing Airlines is improving its fare service to support dynamic fare pricing that balances revenue and customer satisfaction.

The existing fare service is implemented in `fareService.js`. It takes in a flight and booking class and returns the fare for the given flight and booking class. The fare is calculated based on the following criteria:

- Economy is the default booking class and reflects the `base_cost` of a flight, as listed in the `flights` table.
- The fare is higher for higher booking classes (e.g. first class is more expensive than business, which is more expensive than economy).

The airline would like to support dynamic pricing based on the following criteria for all customers:

- The fare should be lower for flights that are in low demand (e.g. flights that are almost empty).
- The fare should be higher for flights that are in high demand (e.g. flights that are almost sold out).
- The fare should be higher for flights that have historically been popular for the given month (e.g. flights that have been sold out in the past).

If the user is a loyalty program member, the airline would like to support the following additional criteria:

- The fare should be lower for flights that have bonus point multiplier promotions.

Feel free to change and restructure any existing code in the fare service. Please add your changes to `fareService.js`, and you may add any additional files as needed.

NOTE: We have provided a small data sample for testing in `airline_reservations_data.db`. You may optionally download a larger version of the database here:

https://storage.googleapis.com/byteboard-static/airline_reservations_data.db

Please make sure to remove any optionally downloaded data from your code before submitting.

