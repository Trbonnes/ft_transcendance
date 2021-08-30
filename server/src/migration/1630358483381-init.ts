import {MigrationInterface, QueryRunner} from "typeorm";

export class init1630358483381 implements MigrationInterface {
    name = 'init1630358483381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "login" character varying NOT NULL, "firstName" character varying NOT NULL, "displayName" character varying NOT NULL, "role" character varying NOT NULL, "avatar" character varying NOT NULL, "defaultAvatar" character varying NOT NULL, "avatarFileName" character varying NOT NULL, "isActive" boolean NOT NULL, "inGame" boolean NOT NULL, "twoFactor" boolean NOT NULL DEFAULT false, "twoFactorCode" character varying, "victory" integer NOT NULL, "defeat" integer NOT NULL, "level" integer NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(), "friends" text array NOT NULL DEFAULT '{}', "game_id" character varying NOT NULL DEFAULT '', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"), CONSTRAINT "UQ_059e69c318702e93998f26d1528" UNIQUE ("displayName"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "senderId" uuid NOT NULL, "channelId" uuid NOT NULL, CONSTRAINT "PK_b01cf5d92374acdd654bcb61df7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isPublic" boolean NOT NULL, "isSticky" boolean NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "UQ_800e6da7e4c30fbb0653ba7bb6c" UNIQUE ("name"), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel_membership" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "channelId" uuid NOT NULL, "isAdmin" boolean NOT NULL, "isBanned" boolean NOT NULL, CONSTRAINT "PK_2adcd844f2ef3a3f79fb64facd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "friend_request" ("id" SERIAL NOT NULL, "senderId" uuid, "receipientId" uuid, CONSTRAINT "PK_4c9d23ff394888750cf66cac17c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "game_id" character varying NOT NULL, "status" boolean NOT NULL, "winner_id" character varying NOT NULL DEFAULT '', "loser_id" character varying NOT NULL DEFAULT '', "date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "FK_4cdc1174bdb04e94b61a92e7078" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_message" ADD CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_membership" ADD CONSTRAINT "FK_c88793b52cd9f7ed827ec732c65" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_membership" ADD CONSTRAINT "FK_dd567fff53e50a79dab6e3f054b" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_9509b72f50f495668bae3c0171c" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_34dc9c5b1dbf28382e320d4a729" FOREIGN KEY ("receipientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_34dc9c5b1dbf28382e320d4a729"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_9509b72f50f495668bae3c0171c"`);
        await queryRunner.query(`ALTER TABLE "channel_membership" DROP CONSTRAINT "FK_dd567fff53e50a79dab6e3f054b"`);
        await queryRunner.query(`ALTER TABLE "channel_membership" DROP CONSTRAINT "FK_c88793b52cd9f7ed827ec732c65"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "FK_67e2cdb305529e00e7abfff8d77"`);
        await queryRunner.query(`ALTER TABLE "channel_message" DROP CONSTRAINT "FK_4cdc1174bdb04e94b61a92e7078"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "friend_request"`);
        await queryRunner.query(`DROP TABLE "channel_membership"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "channel_message"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
