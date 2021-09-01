import {MigrationInterface, QueryRunner} from "typeorm";

export class initasdf1630494790852 implements MigrationInterface {
    name = 'initasdf1630494790852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."channel_message" DROP CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_membership" DROP CONSTRAINT "FK_c88793b52cd9f7ed827ec732c65"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_membership" DROP CONSTRAINT "FK_dd567fff53e50a79dab6e3f054b"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_message" ADD CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."channel_membership" ADD CONSTRAINT "FK_c88793b52cd9f7ed827ec732c65" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."channel_membership" ADD CONSTRAINT "FK_dd567fff53e50a79dab6e3f054b" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."channel_membership" DROP CONSTRAINT "FK_dd567fff53e50a79dab6e3f054b"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_membership" DROP CONSTRAINT "FK_c88793b52cd9f7ed827ec732c65"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_message" DROP CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77"`);
        await queryRunner.query(`ALTER TABLE "public"."channel_membership" ADD CONSTRAINT "FK_dd567fff53e50a79dab6e3f054b" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."channel_membership" ADD CONSTRAINT "FK_c88793b52cd9f7ed827ec732c65" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."channel_message" ADD CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
