import { MigrationInterface, QueryRunner } from "typeorm";

export class EntityChanges1713529194129 implements MigrationInterface {
    name = 'EntityChanges1713529194129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seat" DROP CONSTRAINT "FK_04e3b0713f08d53ec93363d6ae1"`);
        await queryRunner.query(`ALTER TABLE "seat" ALTER COLUMN "auditoriumId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP CONSTRAINT "FK_b049d83d7f9023e6606d0f54917"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ALTER COLUMN "auditoriumId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_be3405f05c2fd44b0efa007e838"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "movieScreeningId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "seat" ADD CONSTRAINT "FK_04e3b0713f08d53ec93363d6ae1" FOREIGN KEY ("auditoriumId") REFERENCES "auditorium"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD CONSTRAINT "FK_b049d83d7f9023e6606d0f54917" FOREIGN KEY ("auditoriumId") REFERENCES "auditorium"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_be3405f05c2fd44b0efa007e838" FOREIGN KEY ("movieScreeningId") REFERENCES "movie_screening"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_be3405f05c2fd44b0efa007e838"`);
        await queryRunner.query(`ALTER TABLE "movie_screening" DROP CONSTRAINT "FK_b049d83d7f9023e6606d0f54917"`);
        await queryRunner.query(`ALTER TABLE "seat" DROP CONSTRAINT "FK_04e3b0713f08d53ec93363d6ae1"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "movieScreeningId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_be3405f05c2fd44b0efa007e838" FOREIGN KEY ("movieScreeningId") REFERENCES "movie_screening"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ALTER COLUMN "auditoriumId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie_screening" ADD CONSTRAINT "FK_b049d83d7f9023e6606d0f54917" FOREIGN KEY ("auditoriumId") REFERENCES "auditorium"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seat" ALTER COLUMN "auditoriumId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "seat" ADD CONSTRAINT "FK_04e3b0713f08d53ec93363d6ae1" FOREIGN KEY ("auditoriumId") REFERENCES "auditorium"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
