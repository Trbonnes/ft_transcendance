import {MigrationInterface, QueryRunner} from "typeorm";

export class UserRoleAdded1628200678646 implements MigrationInterface {
    name = 'UserRoleAdded1628200678646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
