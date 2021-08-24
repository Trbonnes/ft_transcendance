import {MigrationInterface, QueryRunner} from "typeorm";

export class userUpdate1629456107627 implements MigrationInterface {
    name = 'userUpdate1629456107627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "defaultAvatar" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarFileName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarFileName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "defaultAvatar"`);
    }

}
