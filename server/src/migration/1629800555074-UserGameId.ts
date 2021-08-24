import {MigrationInterface, QueryRunner} from "typeorm";

export class UserGameId1629800555074 implements MigrationInterface {
    name = 'UserGameId1629800555074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "game_id" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "game_id"`);
    }

}
