import { MigrationInterface, QueryRunner } from 'typeorm';
import 'dotenv/config';

export class SetTimeZoneToUTC1710236495058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER DATABASE ${process.env.POSTGRES_DB} SET TIMEZONE TO 'UTC';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
