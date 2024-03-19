import { MigrationInterface, QueryRunner } from "typeorm";

export class MovieEntityIsDeletedToDisabled1710850123687 implements MigrationInterface {
    name = 'MovieEntityIsDeletedToDisabled1710850123687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" RENAME COLUMN "isDeleted" TO "disabled"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" RENAME COLUMN "disabled" TO "isDeleted"`);
    }

}
