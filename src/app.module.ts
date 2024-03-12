import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './roles/roles.guard';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { SmtpModule } from './smtp/smtp.module';
import { ApplicationsModule } from './applications/applications.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    TokensModule,
    SmtpModule,
    ApplicationsModule,
    FilesModule
  ]
})
export class AppModule {}
