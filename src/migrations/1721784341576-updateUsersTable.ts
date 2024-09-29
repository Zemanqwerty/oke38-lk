import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateUsersTable1721784341576 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('tbluserinfo', new TableColumn({
          name: 'activationLink',
          type: 'varchar',
          isNullable: true,
        }));

        await queryRunner.addColumn('tbluserinfo', new TableColumn({
          name: 'resetPasswordLink',
          type: 'varchar',
          isNullable: true,
        }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('tbluserinfo', 'activationLink');
      await queryRunner.dropColumn('tbluserinfo', 'resetPasswordLink');
  }

}
