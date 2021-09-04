import {MigrationInterface, QueryRunner} from "typeorm";

export class addedBlockedUsers1630796629512 implements MigrationInterface {
    name = 'addedBlockedUsers1630796629512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "blockedUsers" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "blockedUsers"`);
    }

}
