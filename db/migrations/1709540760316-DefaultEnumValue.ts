import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultEnumValue1709540760316 implements MigrationInterface {
    name = 'DefaultEnumValue1709540760316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userType" SET DEFAULT 'CUSTOMER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userType" DROP DEFAULT`);
    }

}
