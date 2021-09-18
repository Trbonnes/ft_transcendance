import {MigrationInterface, QueryRunner} from "typeorm";

export class timeout1632002756432 implements MigrationInterface {
    name = 'timeout1632002756432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channel_timeout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "membershipId" character varying NOT NULL, "start" TIMESTAMP NOT NULL DEFAULT now(), "end" TIMESTAMP NOT NULL, CONSTRAINT "PK_89d6a7730141f20efb148357f18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."channel_membership" DROP COLUMN "isBanned"`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" DROP COLUMN "membershipId"`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" ADD "membershipId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" ADD "start" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" ADD "end" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_timeout" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" DROP COLUMN "membershipId"`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" ADD "end" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" ADD "start" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "channel_timeout" ADD "membershipId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."channel_membership" ADD "isBanned" boolean NOT NULL`);
        await queryRunner.query(`DROP TABLE "channel_timeout"`);
    }

}
