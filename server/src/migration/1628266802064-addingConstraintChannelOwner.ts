import {MigrationInterface, QueryRunner} from "typeorm";

export class addingConstraintChannelOwner1628266802064 implements MigrationInterface {
    name = 'addingConstraintChannelOwner1628266802064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_033c6c164664caf44ca6199d63b"`);
        await queryRunner.query(`ALTER TABLE "channel" RENAME COLUMN "owner_id" TO "ownerId"`);
        await queryRunner.query(`ALTER TABLE "channel" RENAME CONSTRAINT "UQ_033c6c164664caf44ca6199d63b" TO "UQ_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "channel" RENAME CONSTRAINT "UQ_bdfef605fedc02f3f9d60f1bc07" TO "UQ_033c6c164664caf44ca6199d63b"`);
        await queryRunner.query(`ALTER TABLE "channel" RENAME COLUMN "ownerId" TO "owner_id"`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_033c6c164664caf44ca6199d63b" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
