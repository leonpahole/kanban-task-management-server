import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSequencenNumbers1677732948974 implements MigrationInterface {
    name = 'AddSequencenNumbers1677732948974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subtask" ADD "isCompleted" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD "sequenceNumber" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "column" ADD "sequenceNumber" SERIAL NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "column" DROP COLUMN "sequenceNumber"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "sequenceNumber"`);
        await queryRunner.query(`ALTER TABLE "subtask" DROP COLUMN "isCompleted"`);
    }

}
