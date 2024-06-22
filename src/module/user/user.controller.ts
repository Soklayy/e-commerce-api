import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/commons/enums';
import { Public } from 'src/commons/decorators/public.decorator';

@Roles(Role.ADMIN)
// @Public()
@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  async create(
    @Body()
    createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.create(createUserDto, file);
  }

  @Get()
  @Public()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const user = await this.userService.findOneById(id);
    delete user.password;

    return user;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImage'))
  async update(
    @Body()
    updatteUserDto: UpdateUserDto,
    @Param('id')
    id: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.userService.update(id, updatteUserDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
