import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class war1623068709413 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'war'
            }),
            false,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE war`);
    }

}
