import {MigrationInterface, QueryRunner} from "typeorm";

export class init1628265708548 implements MigrationInterface {
    name = 'init1628265708548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friendship" ("status" boolean NOT NULL, CONSTRAINT "PK_66ab10b3a603f916db2d8314116" PRIMARY KEY ("status"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" boolean NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "winnerId" uuid, CONSTRAINT "REL_cd57acb58d1147c23da5cd09ca" UNIQUE ("winnerId"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "login" character varying NOT NULL, "firstName" character varying NOT NULL, "displayName" character varying NOT NULL, "avatar" character varying NOT NULL, "isActive" boolean NOT NULL, "inGame" boolean NOT NULL, "twoFactor" boolean NOT NULL DEFAULT false, "twoFactorCode" character varying, "victory" integer NOT NULL, "defeat" integer NOT NULL, "ladder" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"), CONSTRAINT "UQ_059e69c318702e93998f26d1528" UNIQUE ("displayName"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isPublic" boolean NOT NULL, "isSticky" boolean NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_800e6da7e4c30fbb0653ba7bb6c" UNIQUE ("name"), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_games_game" ("userId" uuid NOT NULL, "gameId" uuid NOT NULL, CONSTRAINT "PK_76d0f4a61ce0cb59495368ac00f" PRIMARY KEY ("userId", "gameId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_baff119d1ed4b1df8467c35116" ON "user_games_game" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3540c475bb3729b5ead346bc4c" ON "user_games_game" ("gameId") `);
        await queryRunner.query(`CREATE TABLE "user_friendships_friendship" ("userId" uuid NOT NULL, "friendshipStatus" boolean NOT NULL, CONSTRAINT "PK_232e9d7183449a9f80f0df3b20a" PRIMARY KEY ("userId", "friendshipStatus"))`);
        await queryRunner.query(`CREATE INDEX "IDX_125535bf746eefacbb606ec522" ON "user_friendships_friendship" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f36bf344db41b3c234f20b83ef" ON "user_friendships_friendship" ("friendshipStatus") `);
        await queryRunner.query(`CREATE TABLE "user_channels_channel" ("userId" uuid NOT NULL, "channelId" uuid NOT NULL, CONSTRAINT "PK_01cb58c2f493472e335712d76c7" PRIMARY KEY ("userId", "channelId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9c701cabd952769d5c75844343" ON "user_channels_channel" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab9fe5d9528e30e09b462c345d" ON "user_channels_channel" ("channelId") `);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae" FOREIGN KEY ("winnerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_games_game" ADD CONSTRAINT "FK_baff119d1ed4b1df8467c351161" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_games_game" ADD CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_friendships_friendship" ADD CONSTRAINT "FK_125535bf746eefacbb606ec522d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_friendships_friendship" ADD CONSTRAINT "FK_f36bf344db41b3c234f20b83ef7" FOREIGN KEY ("friendshipStatus") REFERENCES "friendship"("status") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_channels_channel" ADD CONSTRAINT "FK_9c701cabd952769d5c75844343c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_channels_channel" ADD CONSTRAINT "FK_ab9fe5d9528e30e09b462c345d2" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_channels_channel" DROP CONSTRAINT "FK_ab9fe5d9528e30e09b462c345d2"`);
        await queryRunner.query(`ALTER TABLE "user_channels_channel" DROP CONSTRAINT "FK_9c701cabd952769d5c75844343c"`);
        await queryRunner.query(`ALTER TABLE "user_friendships_friendship" DROP CONSTRAINT "FK_f36bf344db41b3c234f20b83ef7"`);
        await queryRunner.query(`ALTER TABLE "user_friendships_friendship" DROP CONSTRAINT "FK_125535bf746eefacbb606ec522d"`);
        await queryRunner.query(`ALTER TABLE "user_games_game" DROP CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2"`);
        await queryRunner.query(`ALTER TABLE "user_games_game" DROP CONSTRAINT "FK_baff119d1ed4b1df8467c351161"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae"`);
        await queryRunner.query(`DROP INDEX "IDX_ab9fe5d9528e30e09b462c345d"`);
        await queryRunner.query(`DROP INDEX "IDX_9c701cabd952769d5c75844343"`);
        await queryRunner.query(`DROP TABLE "user_channels_channel"`);
        await queryRunner.query(`DROP INDEX "IDX_f36bf344db41b3c234f20b83ef"`);
        await queryRunner.query(`DROP INDEX "IDX_125535bf746eefacbb606ec522"`);
        await queryRunner.query(`DROP TABLE "user_friendships_friendship"`);
        await queryRunner.query(`DROP INDEX "IDX_3540c475bb3729b5ead346bc4c"`);
        await queryRunner.query(`DROP INDEX "IDX_baff119d1ed4b1df8467c35116"`);
        await queryRunner.query(`DROP TABLE "user_games_game"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "friendship"`);
    }

}
