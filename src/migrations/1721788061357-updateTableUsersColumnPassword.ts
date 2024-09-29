import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUsersColumnPassword1721788061357 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE tbluserinfo ALTER COLUMN password_text TYPE text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE tbluserinfo ALTER COLUMN password_text TYPE character varying(50)`);
    }

}
