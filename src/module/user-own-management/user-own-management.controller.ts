import {
  Controller,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { UserOwnManagementService } from './user-own-management.service';
import { UpdateUserOwnManagementDto } from './dto/update-user-own-management.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/commons/enums';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('User own management')
@Roles(Role.USER)
@ApiBearerAuth()
@Controller('user-own-management')
export class UserOwnManagementController {
  constructor(
    private readonly userOwnManagementService: UserOwnManagementService,
  ) {}

  @Patch()
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('profileImage'))
  update(
    @Req() req: any,
    @Body() updateUserOwnManagementDto: UpdateUserOwnManagementDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req?.user?.id;
    return this.userOwnManagementService.update(
      userId,
      updateUserOwnManagementDto,
      file,
    );
  }
}
