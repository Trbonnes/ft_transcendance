import {MigrationInterface, QueryRunner} from "typeorm";

export class initsdfsdfa1630959527535 implements MigrationInterface {
    name = 'initsdfsdfa1630959527535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "FK_e48e484b55f6e96c6bd14351145"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "FK_b98079c6090c176df6f2f4a058c"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "REL_e48e484b55f6e96c6bd1435114"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "REL_b98079c6090c176df6f2f4a058"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "FK_e48e484b55f6e96c6bd14351145" FOREIGN KEY ("user1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "FK_b98079c6090c176df6f2f4a058c" FOREIGN KEY ("user2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "FK_b98079c6090c176df6f2f4a058c"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "FK_e48e484b55f6e96c6bd14351145"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "REL_b98079c6090c176df6f2f4a058" UNIQUE ("user2Id")`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "REL_e48e484b55f6e96c6bd1435114" UNIQUE ("user1Id")`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "FK_b98079c6090c176df6f2f4a058c" FOREIGN KEY ("user2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "FK_e48e484b55f6e96c6bd14351145" FOREIGN KEY ("user1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
