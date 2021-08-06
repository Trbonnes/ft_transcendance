import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingStickyFLag1628252991797 implements MigrationInterface {
    name = 'AddingStickyFLag1628252991797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" ADD "isSticky" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "isSticky"`);
    }

}
