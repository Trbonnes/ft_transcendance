import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class userInGuild1623067280239 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'userInGuild'
            }),
            false,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE userInGuild`);
    }

}
