import {MigrationInterface, QueryRunner} from "typeorm";

export class GameRefactoring1629456215513 implements MigrationInterface {
    name = 'GameRefactoring1629456215513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_games_game" DROP CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2"`);
        await queryRunner.query(`ALTER TABLE "game" ADD "game_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD "loserId" uuid`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "UQ_534fe1b4be4a16b996ba7d78e76" UNIQUE ("loserId")`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_534fe1b4be4a16b996ba7d78e76" FOREIGN KEY ("loserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_games_game" ADD CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_games_game" DROP CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_534fe1b4be4a16b996ba7d78e76"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "UQ_534fe1b4be4a16b996ba7d78e76"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "loserId"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "game_id"`);
        await queryRunner.query(`ALTER TABLE "user_games_game" ADD CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
