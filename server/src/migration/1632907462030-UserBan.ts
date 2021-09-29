import {MigrationInterface, QueryRunner} from "typeorm";

export class UserBan1632907462030 implements MigrationInterface {
    name = 'UserBan1632907462030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "banned" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "banned"`);
    }

}
