import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketEntityForeignKeys1713533232226 implements MigrationInterface {
    name = 'TicketEntityForeignKeys1713533232226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_ab9b02f72bbc7d05bd15a5cb6b4"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_0e01a7c92f008418bad6bad5919"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "seatId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_ab9b02f72bbc7d05bd15a5cb6b4" FOREIGN KEY ("seatId") REFERENCES "seat"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_0e01a7c92f008418bad6bad5919" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_0e01a7c92f008418bad6bad5919"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_ab9b02f72bbc7d05bd15a5cb6b4"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "seatId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_0e01a7c92f008418bad6bad5919" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_ab9b02f72bbc7d05bd15a5cb6b4" FOREIGN KEY ("seatId") REFERENCES "seat"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
