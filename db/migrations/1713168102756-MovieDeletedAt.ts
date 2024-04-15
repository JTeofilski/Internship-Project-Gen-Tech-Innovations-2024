import { MigrationInterface, QueryRunner } from "typeorm";

export class MovieDeletedAt1713168102756 implements MigrationInterface {
    name = 'MovieDeletedAt1713168102756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "deletedAt"`);
    }

}
