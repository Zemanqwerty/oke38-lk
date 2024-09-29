import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCreatedAtUsertable1722084949138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "tbluserinfo"
          ALTER COLUMN "date_create_user" SET DEFAULT CURRENT_TIMESTAMP
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "tbluserinfo"
          ALTER COLUMN "date_create_user" DROP DEFAULT
        `);
      }

}
