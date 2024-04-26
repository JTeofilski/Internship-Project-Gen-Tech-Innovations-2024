import { MigrationInterface, QueryRunner } from "typeorm";

export class ResetCodeField1714116956483 implements MigrationInterface {
    name = 'ResetCodeField1714116956483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "resetCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetCode"`);
    }

}
