import { Module } from '@nestjs/common';
import { UserTypesModule } from './user-types/user-types.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { FilialsModule } from './filials/filials.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './roles/roles.guard';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { SmtpModule } from './smtp/smtp.module';
import { ApplicationsModule } from './applications/applications.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';
// import { MesasgesFilesModule } from './mesasges-files/mesasges-files.module';
import { ApplicationTypeModule } from './application-type/application-type.module';
import { DocumentsModule } from './docsFiles/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/'),
      serveRoot: '/',
    }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT) || 5432,
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   migrations: ["src/migrations/*{.ts,.js}"],
    //   synchronize: false,
    // }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Отключаем синхронизацию
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migrations',
        },
      }),
    }),
    
    ChatModule,
    UserTypesModule,
    UserRolesModule,
    FilialsModule,
    UsersModule,
    RolesModule,
    AuthModule,
    TokensModule,
    SmtpModule,
    ApplicationsModule,
    FilesModule,
    ChatModule,
    MessagesModule,
    ApplicationTypeModule,
    DocumentsModule,
    // MesasgesFilesModule
  ]
})
export class AppModule {}
