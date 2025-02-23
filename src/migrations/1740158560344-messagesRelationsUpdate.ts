import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class MessagesRelationsUpdate1740158560344 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Удаляем старую таблицу message
    await queryRunner.dropTable('message', true);

    // 2. Создаем новую таблицу message с правильной структурой
    await queryRunner.createTable(
      new Table({
        name: 'message',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'chatId',
            type: 'uuid', // Изменено на uuid
            isNullable: false,
          },
          {
            name: 'messageText',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'fileUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'fileName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'sender',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['chatId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'chat',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['sender'],
            referencedColumnNames: ['id_user'],
            referencedTableName: 'tbluserinfo',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Удаляем новую таблицу message
    await queryRunner.dropTable('message', true);

    // 2. Восстанавливаем старую таблицу message (если необходимо)
    await queryRunner.createTable(
      new Table({
        name: 'message',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'chatId',
            type: 'integer', // Старый тип данных
            isNullable: false,
          },
          {
            name: 'messageText',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'fileUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'fileName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'senderRole',
            type: 'enum',
            enum: ['Admin', 'Client'], // Замените на ваши реальные роли
            isNullable: false,
          },
          {
            name: 'sender',
            type: 'varchar', // Старый тип данных
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['chatId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'chat',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

}
