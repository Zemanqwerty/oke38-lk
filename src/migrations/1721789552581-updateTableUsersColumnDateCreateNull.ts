import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUsersColumnDateCreateNull1721789552581 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE tbluserinfo ALTER COLUMN date_create_user DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE tbluserinfo ALTER COLUMN date_create_user SET NOT NULL`);
    }

}
