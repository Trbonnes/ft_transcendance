import {MigrationInterface, QueryRunner} from "typeorm";

export class GameRefactoring1629456547040 implements MigrationInterface {
    name = 'GameRefactoring1629456547040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_games_game" DROP CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2"`);
        await queryRunner.query(`ALTER TABLE "user_games_game" ADD CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_games_game" DROP CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2"`);
        await queryRunner.query(`ALTER TABLE "user_games_game" ADD CONSTRAINT "FK_3540c475bb3729b5ead346bc4c2" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
