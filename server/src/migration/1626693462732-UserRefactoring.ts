import {MigrationInterface, QueryRunner} from "typeorm";

export class UserRefactoring1626693462732 implements MigrationInterface {
    name = 'UserRefactoring1626693462732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "guild"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "wonTournaments"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "wonTournaments" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "guild" character varying NOT NULL`);
    }

}
