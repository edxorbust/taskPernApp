import pg from "pg";
import { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from "./config.js";

export let pool;

export const connectDB = async () => {
  try {
    pool = new pg.Pool({
      port: PG_PORT,
      host: PG_HOST,
      user: PG_USER,
      password: PG_PASSWORD,
      database: PG_DATABASE,
    });
    await pool.connect();
    console.log(">>> DB is connected");
  } catch (error) {
    console.log(error);
  }
};

