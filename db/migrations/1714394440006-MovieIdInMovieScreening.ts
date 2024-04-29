import { MigrationInterface, QueryRunner } from "typeorm";

export class MovieIdInMovieScreening1714394440006 implements MigrationInterface {
    name = 'MovieIdInMovieScreening1714394440006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP CONSTRAINT "FK_fed5d0d6cad75e519b744e19d64"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ALTER COLUMN "movieId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD CONSTRAINT "FK_fed5d0d6cad75e519b744e19d64" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP CONSTRAINT "FK_fed5d0d6cad75e519b744e19d64"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ALTER COLUMN "movieId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD CONSTRAINT "FK_fed5d0d6cad75e519b744e19d64" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
