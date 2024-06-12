import { Module } from '@nestjs/common';
import { UserOwnManagementService } from './user-own-management.service';
import { UserOwnManagementController } from './user-own-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Address } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address]), UserModule],
  controllers: [UserOwnManagementController],
  providers: [UserOwnManagementService],
})
export class UserOwnManagementModule {}
