import {MigrationInterface, QueryRunner} from "typeorm";

export class timeout31632040521878 implements MigrationInterface {
    name = 'timeout31632040521878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" DROP CONSTRAINT "FK_bcef2f3d47afb0caf24405cd89c"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" DROP CONSTRAINT "UQ_bcef2f3d47afb0caf24405cd89c"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" DROP COLUMN "membershipId"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" ADD "membershipId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" ADD CONSTRAINT "UQ_bcef2f3d47afb0caf24405cd89c" UNIQUE ("membershipId")`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" ADD "start" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" ADD "end" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" ADD CONSTRAINT "FK_bcef2f3d47afb0caf24405cd89c" FOREIGN KEY ("membershipId") REFERENCES "channel_membership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" DROP CONSTRAINT "FK_bcef2f3d47afb0caf24405cd89c"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" DROP CONSTRAINT "UQ_bcef2f3d47afb0caf24405cd89c"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" DROP COLUMN "membershipId"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" ADD "end" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" ADD "start" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" ADD "membershipId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" ADD CONSTRAINT "UQ_bcef2f3d47afb0caf24405cd89c" UNIQUE ("membershipId")`);
        await queryRunner.query(`ALTER TABLE "public"."channel_timeout" ADD CONSTRAINT "FK_bcef2f3d47afb0caf24405cd89c" FOREIGN KEY ("membershipId") REFERENCES "channel_membership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
