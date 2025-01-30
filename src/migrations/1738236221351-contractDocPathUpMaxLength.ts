import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateContractDocFilePathLength1698745600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Изменяем длину поля doc_file_path до 256 символов
    await queryRunner.query(`
      ALTER TABLE tblcontractdoc
      ALTER COLUMN doc_file_path TYPE VARCHAR(256);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Откатываем изменения, если нужно вернуться к предыдущей длине (например, 255 символов)
    await queryRunner.query(`
      ALTER TABLE tblcontractdoc
      ALTER COLUMN doc_file_path TYPE VARCHAR(255);
    `);
  }
}