import {MigrationInterface, QueryRunner} from "typeorm";

export class auth1627823820120 implements MigrationInterface {
    name = 'auth1627823820120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twoFactors"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAdministrator"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "twoFactor" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "twoFactorToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twoFactorToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twoFactor"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isAdministrator" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "twoFactors" boolean NOT NULL`);
    }

}
