import {MigrationInterface, QueryRunner} from "typeorm";

export class initsdfsdfaadf1630960343923 implements MigrationInterface {
    name = 'initsdfsdfaadf1630960343923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP COLUMN "lastMessageUpdate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD "lastMessageUpdate" TIMESTAMP NOT NULL`);
    }

}
