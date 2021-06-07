import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class userInChatRoom1623067752032 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'userInChatRoom'
            }),
            false,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE userInChatRoom`);
    }

}
