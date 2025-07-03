const { Pool } = require('pg');
require('dotenv').config();
//import { config } from 'dotenv';

const pool = new Pool({
//  user: process.env.DB_USER,
  user: 'postgres',
//  host: process.env.DB_HOST,
  host: 'localhost',
//  database: process.env.DB_NAME,
  database: 'mydatabase',
  password: 'postgres',
//  password: process.env.DB_PASSWORD,
//port: process.env.DB_PORT,
port: '5432',
});

module.exports = pool;