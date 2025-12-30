import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const connection = mysql.createPool({
  uri: process.env.MYSQL_PUBLIC_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});
