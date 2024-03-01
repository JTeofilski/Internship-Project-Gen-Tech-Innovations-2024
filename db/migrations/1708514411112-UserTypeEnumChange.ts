import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTypeEnumChange1708514411112 implements MigrationInterface {
    name = 'UserTypeEnumChange1708514411112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userType"`);
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('ADMIN', 'CUSTOMER')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userType" "public"."user_usertype_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userType"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userType" integer NOT NULL`);
    }

}
