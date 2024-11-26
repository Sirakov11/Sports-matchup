import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      database: "sports_matchup",
      user: "postgres",
      password: process.env.DB_PASSWORD,
      host: "127.0.0.1", 
      port: 5432   
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    seeds: {
      directory: './seeds'           
    }
    
  }
};

module.exports = {config}