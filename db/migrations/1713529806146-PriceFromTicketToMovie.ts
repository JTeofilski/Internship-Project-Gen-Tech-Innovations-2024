import { MigrationInterface, QueryRunner } from "typeorm";

export class PriceFromTicketToMovie1713529806146 implements MigrationInterface {
    name = 'PriceFromTicketToMovie1713529806146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "price" integer NOT NULL`);
    }

}
