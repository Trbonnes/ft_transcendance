import {MigrationInterface, QueryRunner} from "typeorm";

export class friendsRefactoring1629238458908 implements MigrationInterface {
    name = 'friendsRefactoring1629238458908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" boolean NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "winnerId" uuid, CONSTRAINT "REL_cd57acb58d1147c23da5cd09ca" UNIQUE ("winnerId"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "login" character varying NOT NULL, "firstName" character varying NOT NULL, "displayName" character varying NOT NULL, "role" character varying NOT NULL, "avatar" character varying NOT NULL, "isActive" boolean NOT NULL, "inGame" boolean NOT NULL, "twoFactor" boolean NOT NULL DEFAULT false, "twoFactorCode" character varying, "victory" integer NOT NULL, "defeat" integer NOT NULL, "level" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(), "friends" text array NOT NULL DEFAULT '{}', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"), CONSTRAINT "UQ_059e69c318702e93998f26d1528" UNIQUE ("displayName"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "friend_request" ("id" SERIAL NOT NULL, "senderId" uuid, "receipientId" uuid, CONSTRAINT "PK_4c9d23ff394888750cf66cac17c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_games_game" ("userId" uuid NOT NULL, "gameId" uuid NOT NULL, CONSTRAINT "PK_76d0f4a61ce0cb59495368ac00f" PRIMARY KEY ("userId", "gameId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_baff119d1ed4b1df8467c35116" ON "user_games_game" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3540c475bb3729b5ead346bc4c" ON "user_games_game" ("gameId") `);
        await queryRunner.query(`CREATE TABLE "user_channels_channel" ("userId" uuid NOT NULL, "channelId" uuid NOT NULL, CONSTRAINT "PK_01cb58c2f493472e335712d76c7" PRIMARY KEY ("userId", "channelId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9c701cabd952769d5c75844343" ON "user_channels_channel" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab9fe5d9528e30e09b462c345d" ON "user_channels_channel" ("channelId") `);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae" FOREIGN KEY ("winnerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_9509b72f50f495668bae3c0171c" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_34dc9c5b1dbf28382e320d4a729" FOREIGN KEY ("receipientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_games_game" ADD CONSTRAINT "FK_baff119d1ed4b1df8467c351161" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_games_game" ADD CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_channels_channel" ADD CONSTRAINT "FK_9c701cabd952769d5c75844343c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_channels_channel" ADD CONSTRAINT "FK_ab9fe5d9528e30e09b462c345d2" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_channels_channel" DROP CONSTRAINT "FK_ab9fe5d9528e30e09b462c345d2"`);
        await queryRunner.query(`ALTER TABLE "user_channels_channel" DROP CONSTRAINT "FK_9c701cabd952769d5c75844343c"`);
        await queryRunner.query(`ALTER TABLE "user_games_game" DROP CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2"`);
        await queryRunner.query(`ALTER TABLE "user_games_game" DROP CONSTRAINT "FK_baff119d1ed4b1df8467c351161"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_34dc9c5b1dbf28382e320d4a729"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_9509b72f50f495668bae3c0171c"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae"`);
        await queryRunner.query(`DROP INDEX "IDX_ab9fe5d9528e30e09b462c345d"`);
        await queryRunner.query(`DROP INDEX "IDX_9c701cabd952769d5c75844343"`);
        await queryRunner.query(`DROP TABLE "user_channels_channel"`);
        await queryRunner.query(`DROP INDEX "IDX_3540c475bb3729b5ead346bc4c"`);
        await queryRunner.query(`DROP INDEX "IDX_baff119d1ed4b1df8467c35116"`);
        await queryRunner.query(`DROP TABLE "user_games_game"`);
        await queryRunner.query(`DROP TABLE "friend_request"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "game"`);
    }

}
