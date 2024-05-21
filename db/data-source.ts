import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { UserSubscriber } from 'src/user/subscribers/user.subscriber';

// Preporuka je da se za podesavanje veze sa bazom podataka koristi DataSourceOptions kada se radi sa NestJS-om
// Postoji i druga opcija za podesavanje veze sa bazom podataka, a to je ormconfig koja takodje radi sa NestJS-om
// Shvatila sam da je ormconfig opstiji
// Preporuka: NestJS projekat - DataSourceOptions, NE-NestJS projekat - ormconfig
// Jako bitna stvar ovde je da se ova podesavanja baze rade preko TypeORM-a, i sve ovo gore napisano podrazumeva da je centralni deo podesavanja veze sa bazom TypeORM
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
