import { MigrationInterface, QueryRunner } from "typeorm";

export class MSDeletedDate1713183150473 implements MigrationInterface {
    name = 'MSDeletedDate1713183150473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP COLUMN "deletedAt"`);
    }

}
