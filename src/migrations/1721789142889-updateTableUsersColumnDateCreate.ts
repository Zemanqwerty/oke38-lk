import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUsersColumnDateCreate1721789142889 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE tbluserinfo ALTER COLUMN date_create_user TYPE timestamptz`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE tbluserinfo ALTER COLUMN date_create_user TYPE timestamp`);
    }

}
