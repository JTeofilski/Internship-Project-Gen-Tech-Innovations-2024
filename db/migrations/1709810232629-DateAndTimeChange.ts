import { MigrationInterface, QueryRunner } from "typeorm";

export class DateAndTimeChange1709810232629 implements MigrationInterface {
    name = 'DateAndTimeChange1709810232629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD "dateAndTime" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP COLUMN "dateAndTime"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD "startTime" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD "date" date NOT NULL`);
    }

}
