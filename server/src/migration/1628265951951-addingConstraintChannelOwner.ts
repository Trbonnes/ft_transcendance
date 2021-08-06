import {MigrationInterface, QueryRunner} from "typeorm";

export class addingConstraintChannelOwner1628265951951 implements MigrationInterface {
    name = 'addingConstraintChannelOwner1628265951951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" ADD "ownerId" uuid`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "UQ_bdfef605fedc02f3f9d60f1bc07" UNIQUE ("ownerId")`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "UQ_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "ownerId"`);
    }

}
