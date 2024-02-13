import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1707817562499 implements MigrationInterface {
    name = 'InitialMigration1707817562499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "genre" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isDeleted" boolean NOT NULL, CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name"), CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "duration" integer NOT NULL, "isDeleted" boolean NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "userType" integer NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" SERIAL NOT NULL, "price" integer NOT NULL, "movieScreeningId" integer, "seatId" integer, "userId" integer, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seat" ("id" SERIAL NOT NULL, "row" integer NOT NULL, "column" integer NOT NULL, "auditoriumId" integer, CONSTRAINT "PK_4e72ae40c3fbd7711ccb380ac17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auditorium" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_4826d9c88ec3567e6d122a9fff3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie_screening" ("id" SERIAL NOT NULL, "date" date NOT NULL, "startTime" TIME NOT NULL, "isDeleted" boolean NOT NULL, "movieId" integer, "auditoriumId" integer, CONSTRAINT "PK_ae941d117afe5587a2f11fa79ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genre_movies_movie" ("genreId" integer NOT NULL, "movieId" integer NOT NULL, CONSTRAINT "PK_5b787840ea6352039c37c32e8f0" PRIMARY KEY ("genreId", "movieId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dff457c114a6294863814818b0" ON "genre_movies_movie" ("genreId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e59764a417d4f8291747b744fa" ON "genre_movies_movie" ("movieId") `);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_be3405f05c2fd44b0efa007e838" FOREIGN KEY ("movieScreeningId") REFERENCES "movie_screening"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_ab9b02f72bbc7d05bd15a5cb6b4" FOREIGN KEY ("seatId") REFERENCES "seat"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_0e01a7c92f008418bad6bad5919" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seat" ADD CONSTRAINT "FK_04e3b0713f08d53ec93363d6ae1" FOREIGN KEY ("auditoriumId") REFERENCES "auditorium"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD CONSTRAINT "FK_fed5d0d6cad75e519b744e19d64" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD CONSTRAINT "FK_b049d83d7f9023e6606d0f54917" FOREIGN KEY ("auditoriumId") REFERENCES "auditorium"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" ADD CONSTRAINT "FK_dff457c114a6294863814818b0f" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" ADD CONSTRAINT "FK_e59764a417d4f8291747b744faa" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" DROP CONSTRAINT "FK_e59764a417d4f8291747b744faa"`);
        await queryRunner.query(`ALTER TABLE "genre_movies_movie" DROP CONSTRAINT "FK_dff457c114a6294863814818b0f"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP CONSTRAINT "FK_b049d83d7f9023e6606d0f54917"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP CONSTRAINT "FK_fed5d0d6cad75e519b744e19d64"`);
        await queryRunner.query(`ALTER TABLE "seat" DROP CONSTRAINT "FK_04e3b0713f08d53ec93363d6ae1"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_0e01a7c92f008418bad6bad5919"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_ab9b02f72bbc7d05bd15a5cb6b4"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_be3405f05c2fd44b0efa007e838"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e59764a417d4f8291747b744fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dff457c114a6294863814818b0"`);
        await queryRunner.query(`DROP TABLE "genre_movies_movie"`);
        await queryRunner.query(`DROP TABLE "movie_screening"`);
        await queryRunner.query(`DROP TABLE "auditorium"`);
        await queryRunner.query(`DROP TABLE "seat"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "genre"`);

    }

}
