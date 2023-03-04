import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeBoardNameFromStringToNumber1677683082558 implements MigrationInterface {
    name = 'ChangeBoardNameFromStringToNumber1677683082558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "board" ADD "name" integer NOT NULL`);
    }

}
