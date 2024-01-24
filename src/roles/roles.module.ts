import { Module } from '@nestjs/common';
import { Role } from './roles.enum';

@Module({
    exports: [RolesModule]
})
export class RolesModule {}
