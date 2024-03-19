import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampWithTimeZone1710235343321 implements MigrationInterface {
    name = 'TimestampWithTimeZone1710235343321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP COLUMN "dateAndTime"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD "dateAndTime" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP COLUMN "dateAndTime"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD "dateAndTime" TIMESTAMP NOT NULL`);
    }

}
