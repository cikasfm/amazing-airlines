const { Database } = require("sqlite3");

const DB_FILENAME = "./airline_reservations_data.db";

/**
 * Open a SQLite database
 */
function openDb() {
  return new Database(DB_FILENAME, (err) => err && console.error(`Error connecting to DB. err=${err}`));
}

module.exports = { openDb };
