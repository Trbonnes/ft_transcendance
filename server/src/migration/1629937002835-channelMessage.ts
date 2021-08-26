import {MigrationInterface, QueryRunner} from "typeorm";

export class channelMessage1629937002835 implements MigrationInterface {
    name = 'channelMessage1629937002835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channel_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "senderId" uuid, "channelId" uuid, CONSTRAINT "PK_b01cf5d92374acdd654bcb61df7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "FK_4cdc1174bdb04e94b61a92e7078" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "FK_4cdc1174bdb04e94b61a92e7078"`);
        await queryRunner.query(`DROP TABLE "channel_message"`);
    }

}
