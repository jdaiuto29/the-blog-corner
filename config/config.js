require("dotenv").config()
module.exports = {
  "development": {
    "username": process.env.DB_USER || "postgres",
    "password": process.env.DB_PASS || null,
    "database": "the-blog-corner",
    "host": process.env.DB_HOST || "localhost",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialectOptions": {"ssl": { "require": true, "rejectUnauthorized": false }}

  }
}