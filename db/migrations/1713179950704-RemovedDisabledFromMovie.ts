import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedDisabledFromMovie1713179950704 implements MigrationInterface {
    name = 'RemovedDisabledFromMovie1713179950704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "disabled"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "disabled" boolean NOT NULL`);
    }

}
