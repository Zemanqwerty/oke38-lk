import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatAndMessages1737911804183 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создаем таблицу Chat
        await queryRunner.query(`
          CREATE TABLE "chat" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "applicationId" uuid UNIQUE,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
          )
        `);
    
        // Создаем таблицу Message
        await queryRunner.query(`
          CREATE TABLE "message" (
            "id" SERIAL PRIMARY KEY,
            "messageText" text,
            "fileUrl" text,
            "fileName" text,
            "senderRole" text NOT NULL,
            "sender" text NOT NULL,
            "chatId" uuid,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "FK_chatId" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE
          )
        `);
    
        // Создаем внешний ключ для связи Chat и Applications
        await queryRunner.query(`
          ALTER TABLE "chat"
          ADD CONSTRAINT "FK_applicationId" FOREIGN KEY ("applicationId") REFERENCES "tblzayavka"("id_zayavka") ON DELETE CASCADE
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        // Удаляем таблицы в обратном порядке
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_chatId"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_applicationId"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "chat"`);
      }

}
