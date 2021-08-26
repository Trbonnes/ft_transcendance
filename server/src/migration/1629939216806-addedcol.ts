import {MigrationInterface, QueryRunner} from "typeorm";

export class addedcol1629939216806 implements MigrationInterface {
    name = 'addedcol1629939216806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."channel_message" ADD "content" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."channel_message" DROP COLUMN "content"`);
    }

}
