import {MigrationInterface, QueryRunner} from "typeorm";

export class GamesNowStoreId1629800441690 implements MigrationInterface {
    name = 'GamesNowStoreId1629800441690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."game" ADD "winner_id" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "public"."game" ADD "loser_id" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."game" DROP COLUMN "loser_id"`);
        await queryRunner.query(`ALTER TABLE "public"."game" DROP COLUMN "winner_id"`);
    }

}
