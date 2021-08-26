import {MigrationInterface, QueryRunner} from "typeorm";

export class init21629986470158 implements MigrationInterface {
    name = 'init21629986470158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channel_members_user" ("channelId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_25ed153d61d24dad0870a5920db" PRIMARY KEY ("channelId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0fac7de25481dc00f252d10b6" ON "channel_members_user" ("channelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_640b1b568d70b43b1694bbd07c" ON "channel_members_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "channel_members_user" ADD CONSTRAINT "FK_c0fac7de25481dc00f252d10b69" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "channel_members_user" ADD CONSTRAINT "FK_640b1b568d70b43b1694bbd07c1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel_members_user" DROP CONSTRAINT "FK_640b1b568d70b43b1694bbd07c1"`);
        await queryRunner.query(`ALTER TABLE "channel_members_user" DROP CONSTRAINT "FK_c0fac7de25481dc00f252d10b69"`);
        await queryRunner.query(`DROP INDEX "IDX_640b1b568d70b43b1694bbd07c"`);
        await queryRunner.query(`DROP INDEX "IDX_c0fac7de25481dc00f252d10b6"`);
        await queryRunner.query(`DROP TABLE "channel_members_user"`);
    }

}
