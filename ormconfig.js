const dotenv = require('@nestjs/config/node_modules/dotenv');
const { url } = require('inspector');
const { DataSource } = require('typeorm');
dotenv.config();

const {
  DB_TYPE,
  DB_HOST,
  DB_URI,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  DB_DATABASE,
  DB_SYNC,
} = process.env;

module.exports = new DataSource({
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  url: DB_URI,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  synchronize: DB_SYNC,
});