import {MigrationInterface, QueryRunner} from "typeorm";

export class init21633385518357 implements MigrationInterface {
    name = 'init21633385518357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "FK_75fb061d75fd1f89cb87e963682"`);
        await queryRunner.query(`CREATE TABLE "user_blocked_users_user" ("userId_1" uuid NOT NULL, "userId_2" uuid NOT NULL, CONSTRAINT "PK_5a50f1b1954ace78d65c7c1b5ab" PRIMARY KEY ("userId_1", "userId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_89d0c2f5d9277c7993f979b053" ON "user_blocked_users_user" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a5cb71c9e7c57c175af3f5c6e" ON "user_blocked_users_user" ("userId_2") `);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "blockerId"`);
        await queryRunner.query(`ALTER TABLE "user_blocked_users_user" ADD CONSTRAINT "FK_89d0c2f5d9277c7993f979b0537" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_blocked_users_user" ADD CONSTRAINT "FK_0a5cb71c9e7c57c175af3f5c6e7" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_blocked_users_user" DROP CONSTRAINT "FK_0a5cb71c9e7c57c175af3f5c6e7"`);
        await queryRunner.query(`ALTER TABLE "user_blocked_users_user" DROP CONSTRAINT "FK_89d0c2f5d9277c7993f979b0537"`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "blockerId" uuid`);
        await queryRunner.query(`DROP INDEX "IDX_0a5cb71c9e7c57c175af3f5c6e"`);
        await queryRunner.query(`DROP INDEX "IDX_89d0c2f5d9277c7993f979b053"`);
        await queryRunner.query(`DROP TABLE "user_blocked_users_user"`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "FK_75fb061d75fd1f89cb87e963682" FOREIGN KEY ("blockerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
