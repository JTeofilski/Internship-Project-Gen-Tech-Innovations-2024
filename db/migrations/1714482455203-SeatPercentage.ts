import { MigrationInterface, QueryRunner } from "typeorm";

export class SeatPercentage1714482455203 implements MigrationInterface {
    name = 'SeatPercentage1714482455203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seat" ADD "percentage" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seat" DROP COLUMN "percentage"`);
    }

}
