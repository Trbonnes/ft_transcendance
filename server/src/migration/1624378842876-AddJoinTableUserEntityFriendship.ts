import {MigrationInterface, QueryRunner} from "typeorm";

export class AddJoinTableUserEntityFriendship1624378842876 implements MigrationInterface {
    name = 'AddJoinTableUserEntityFriendship1624378842876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7ab499dcfb170ef3d3539bfdf14"`);
        await queryRunner.query(`CREATE TABLE "user_friendships_friendship" ("userId" uuid NOT NULL, "friendshipStatus" boolean NOT NULL, CONSTRAINT "PK_232e9d7183449a9f80f0df3b20a" PRIMARY KEY ("userId", "friendshipStatus"))`);
        await queryRunner.query(`CREATE INDEX "IDX_125535bf746eefacbb606ec522" ON "user_friendships_friendship" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f36bf344db41b3c234f20b83ef" ON "user_friendships_friendship" ("friendshipStatus") `);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_7ab499dcfb170ef3d3539bfdf14"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userInGuildId"`);
        await queryRunner.query(`ALTER TABLE "user_friendships_friendship" ADD CONSTRAINT "FK_125535bf746eefacbb606ec522d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_friendships_friendship" ADD CONSTRAINT "FK_f36bf344db41b3c234f20b83ef7" FOREIGN KEY ("friendshipStatus") REFERENCES "friendship"("status") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friendships_friendship" DROP CONSTRAINT "FK_f36bf344db41b3c234f20b83ef7"`);
        await queryRunner.query(`ALTER TABLE "user_friendships_friendship" DROP CONSTRAINT "FK_125535bf746eefacbb606ec522d"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userInGuildId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_7ab499dcfb170ef3d3539bfdf14" UNIQUE ("userInGuildId")`);
        await queryRunner.query(`DROP INDEX "IDX_f36bf344db41b3c234f20b83ef"`);
        await queryRunner.query(`DROP INDEX "IDX_125535bf746eefacbb606ec522"`);
        await queryRunner.query(`DROP TABLE "user_friendships_friendship"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_7ab499dcfb170ef3d3539bfdf14" FOREIGN KEY ("userInGuildId") REFERENCES "user_in_guild"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
