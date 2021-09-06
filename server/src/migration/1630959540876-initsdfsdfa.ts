import {MigrationInterface, QueryRunner} from "typeorm";

export class initsdfsdfa1630959540876 implements MigrationInterface {
    name = 'initsdfsdfa1630959540876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "FK_e48e484b55f6e96c6bd14351145"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "FK_b98079c6090c176df6f2f4a058c"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "UQ_e48e484b55f6e96c6bd14351145"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "UQ_b98079c6090c176df6f2f4a058c"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "FK_e48e484b55f6e96c6bd14351145" FOREIGN KEY ("user1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "FK_b98079c6090c176df6f2f4a058c" FOREIGN KEY ("user2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "FK_b98079c6090c176df6f2f4a058c"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" DROP CONSTRAINT "FK_e48e484b55f6e96c6bd14351145"`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "UQ_b98079c6090c176df6f2f4a058c" UNIQUE ("user2Id")`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "UQ_e48e484b55f6e96c6bd14351145" UNIQUE ("user1Id")`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "FK_b98079c6090c176df6f2f4a058c" FOREIGN KEY ("user2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."direct_channel" ADD CONSTRAINT "FK_e48e484b55f6e96c6bd14351145" FOREIGN KEY ("user1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
