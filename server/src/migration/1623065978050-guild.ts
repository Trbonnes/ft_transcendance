import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class guild1623065978050 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'guild'
            }),
            false,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE guild`);
    }

}
