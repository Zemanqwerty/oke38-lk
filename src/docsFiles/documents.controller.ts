import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AuthGuard } from 'src/auth/auth.middleware';
import { RolesGuard } from 'src/auth/authAdmin.middleware';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';

@Controller('documents')
export class DocumentsController {

}
