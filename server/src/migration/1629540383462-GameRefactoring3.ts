import {MigrationInterface, QueryRunner} from "typeorm";

export class GameRefactoring31629540383462 implements MigrationInterface {
    name = 'GameRefactoring31629540383462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_534fe1b4be4a16b996ba7d78e76"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "REL_cd57acb58d1147c23da5cd09ca"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "winnerId"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "UQ_534fe1b4be4a16b996ba7d78e76"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "loserId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ADD "loserId" uuid`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "UQ_534fe1b4be4a16b996ba7d78e76" UNIQUE ("loserId")`);
        await queryRunner.query(`ALTER TABLE "game" ADD "winnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "REL_cd57acb58d1147c23da5cd09ca" UNIQUE ("winnerId")`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_534fe1b4be4a16b996ba7d78e76" FOREIGN KEY ("loserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae" FOREIGN KEY ("winnerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
