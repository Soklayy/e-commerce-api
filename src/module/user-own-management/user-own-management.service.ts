import { Injectable } from '@nestjs/common';
import { UpdateUserOwnManagementDto } from './dto/update-user-own-management.dto';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserOwnManagementService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    private readonly userService: UserService,
  ) {}

  update(
    userid: string,
    updateUserOwnManagementDto: UpdateUserOwnManagementDto,
    file?: Express.Multer.File,
  ) {
    return this.userService.update(userid, updateUserOwnManagementDto, file);
  }
}
