import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { UserSubscriber } from 'src/user/subscribers/user.subscriber';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsTransactionMode: 'each',
  subscribers: [UserSubscriber],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
