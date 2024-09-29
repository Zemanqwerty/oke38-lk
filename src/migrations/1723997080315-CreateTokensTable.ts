import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTokensTable1723997080315 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "tokens" (
                "id" SERIAL PRIMARY KEY,
                "token" character varying NOT NULL,
                "user_id" UUID NOT NULL UNIQUE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                FOREIGN KEY ("user_id") REFERENCES "tbluserinfo"("id_user")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tokens"`);
    }

}
