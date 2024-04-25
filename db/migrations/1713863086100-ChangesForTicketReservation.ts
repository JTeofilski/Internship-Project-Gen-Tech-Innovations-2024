import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangesForTicketReservation1713863086100 implements MigrationInterface {
    name = 'ChangesForTicketReservation1713863086100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ticket_ticketstatus_enum" AS ENUM('BOUGHT', 'RESERVED')`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "ticketStatus" "public"."ticket_ticketstatus_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "reservedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "reservedAt"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "ticketStatus"`);
        await queryRunner.query(`DROP TYPE "public"."ticket_ticketstatus_enum"`);
    }

}
