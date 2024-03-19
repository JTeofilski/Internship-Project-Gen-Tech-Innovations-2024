import { MigrationInterface, QueryRunner } from "typeorm";

export class MovieScreeningStatusField1710851285713 implements MigrationInterface {
    name = 'MovieScreeningStatusField1710851285713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_screening" RENAME COLUMN "isDeleted" TO "status"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."movie_screening_status_enum" AS ENUM('CANCELED', 'ACTIVE', 'FINISHED')`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD "status" "public"."movie_screening_status_enum" NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."movie_screening_status_enum"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD "status" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie_screening" RENAME COLUMN "status" TO "isDeleted"`);
    }

}
