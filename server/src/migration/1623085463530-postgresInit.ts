import {MigrationInterface, QueryRunner} from "typeorm";

export class postgresInit1623085463530 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`CREATE TABLE "user_in_guild" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isOwner" boolean NOT NULL, "isOfficer" boolean NOT NULL, "guildId" uuid, CONSTRAINT "PK_36b665dcb2b4e8a79505b7989d6" PRIMARY KEY ("id"));
        CREATE TABLE "user_in_chat_room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isOwner" boolean NOT NULL, "isAdministrator" boolean NOT NULL, "userId" uuid, "chatRoomId" uuid, CONSTRAINT "PK_e9fe55811faecf29b99348f07ad" PRIMARY KEY ("id"));
        CREATE TABLE "chat_room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8aa3a52cf74c96469f0ef9fbe3e" PRIMARY KEY ("id"));
        CREATE TABLE "guild_wars_war" ("guildId" uuid NOT NULL, "warId" uuid NOT NULL, CONSTRAINT "PK_8139bd79171ab09988b07232a67" PRIMARY KEY ("guildId", "warId"));
        CREATE INDEX "IDX_6f981e59322323c026549ef8f2" ON "guild_wars_war" ("guildId");
        CREATE INDEX "IDX_eeb6fc14e45a65d6d2a2f54347" ON "guild_wars_war" ("warId");
        CREATE TABLE "user_games_game" ("userId" uuid NOT NULL, "gameId" uuid NOT NULL, CONSTRAINT "PK_76d0f4a61ce0cb59495368ac00f" PRIMARY KEY ("userId", "gameId"));
        CREATE INDEX "IDX_baff119d1ed4b1df8467c35116" ON "user_games_game" ("userId");
        CREATE INDEX "IDX_3540c475bb3729b5ead346bc4c" ON "user_games_game" ("gameId");
        ALTER TABLE "friendship" ADD "status" boolean NOT NULL;
        ALTER TABLE "friendship" ADD CONSTRAINT "PK_66ab10b3a603f916db2d8314116" PRIMARY KEY ("status");
        ALTER TABLE "game" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4();
        ALTER TABLE "game" ADD CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id");
        ALTER TABLE "game" ADD "status" boolean NOT NULL;
        ALTER TABLE "game" ADD "date" TIMESTAMP NOT NULL DEFAULT now();
        ALTER TABLE "game" ADD "winnerId" uuid;
        ALTER TABLE "game" ADD CONSTRAINT "UQ_cd57acb58d1147c23da5cd09cae" UNIQUE ("winnerId");
        ALTER TABLE "war" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4();
        ALTER TABLE "war" ADD CONSTRAINT "PK_9e70fb6a71074714eb0c2959aec" PRIMARY KEY ("id");
        ALTER TABLE "war" ADD "status" boolean NOT NULL;
        ALTER TABLE "war" ADD "date" TIMESTAMP NOT NULL DEFAULT now();
        ALTER TABLE "war" ADD "winnerId" uuid;
        ALTER TABLE "war" ADD CONSTRAINT "UQ_c0c6ecdd0c4ee1a45e84fc80834" UNIQUE ("winnerId");
        ALTER TABLE "guild" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4();
        ALTER TABLE "guild" ADD CONSTRAINT "PK_cfbbd0a2805cab7053b516068a3" PRIMARY KEY ("id");
        ALTER TABLE "guild" ADD "name" character varying NOT NULL;
        ALTER TABLE "guild" ADD "tag" character varying NOT NULL;
        ALTER TABLE "guild" ADD "description" character varying NOT NULL;
        ALTER TABLE "guild" ADD "points" integer NOT NULL;
        ALTER TABLE "guild" ADD "war" boolean NOT NULL;
        ALTER TABLE "guild" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now();
        ALTER TABLE "guild" ADD "lastUpdated" TIMESTAMP NOT NULL DEFAULT now();
        ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4();
        ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id");
        ALTER TABLE "user" ADD "email" character varying NOT NULL;
        ALTER TABLE "user" ADD "password" character varying NOT NULL;
        ALTER TABLE "user" ADD "name" character varying NOT NULL;
        ALTER TABLE "user" ADD "avatar" character varying NOT NULL;
        ALTER TABLE "user" ADD "isActive" boolean NOT NULL;
        ALTER TABLE "user" ADD "inGame" boolean NOT NULL;
        ALTER TABLE "user" ADD "guild" character varying NOT NULL;
        ALTER TABLE "user" ADD "twoFactors" boolean NOT NULL;
        ALTER TABLE "user" ADD "victory" integer NOT NULL;
        ALTER TABLE "user" ADD "defeat" integer NOT NULL;
        ALTER TABLE "user" ADD "ladder" integer NOT NULL;
        ALTER TABLE "user" ADD "wonTournaments" integer NOT NULL;
        ALTER TABLE "user" ADD "isAdministrator" boolean NOT NULL;
        ALTER TABLE "user" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now();
        ALTER TABLE "user" ADD "lastUpdated" TIMESTAMP NOT NULL DEFAULT now();
        ALTER TABLE "user" ADD "userInGuildId" uuid;
        ALTER TABLE "user" ADD CONSTRAINT "UQ_7ab499dcfb170ef3d3539bfdf14" UNIQUE ("userInGuildId");
        ALTER TABLE "game" ADD CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae" FOREIGN KEY ("winnerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "war" ADD CONSTRAINT "FK_c0c6ecdd0c4ee1a45e84fc80834" FOREIGN KEY ("winnerId") REFERENCES "guild"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "user_in_guild" ADD CONSTRAINT "FK_9febf6d44e54f336ff0097359b0" FOREIGN KEY ("guildId") REFERENCES "guild"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "user" ADD CONSTRAINT "FK_7ab499dcfb170ef3d3539bfdf14" FOREIGN KEY ("userInGuildId") REFERENCES "user_in_guild"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "user_in_chat_room" ADD CONSTRAINT "FK_3d01e6a6507b3a37526d240663a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "user_in_chat_room" ADD CONSTRAINT "FK_c3b6ecd26be62951421eca2200a" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "guild_wars_war" ADD CONSTRAINT "FK_6f981e59322323c026549ef8f29" FOREIGN KEY ("guildId") REFERENCES "guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "guild_wars_war" ADD CONSTRAINT "FK_eeb6fc14e45a65d6d2a2f543479" FOREIGN KEY ("warId") REFERENCES "war"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE "user_games_game" ADD CONSTRAINT "FK_baff119d1ed4b1df8467c351161" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "user_games_game" ADD CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE user_in_guild`);
        queryRunner.query(`DROP TABLE user_in_chat_room`);
        queryRunner.query(`DROP TABLE chat_room`);
        queryRunner.query(`DROP TABLE guild_wars_war`);
        queryRunner.query(`DROP TABLE user_games_game`);
    }

}
