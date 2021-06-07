import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class chatRoom1623067740353 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'chatRoom'
            }),
            false,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE chatRoom`);
    }

}
