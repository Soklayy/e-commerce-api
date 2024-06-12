import { User as UserEntity } from 'src/module/user/entities/user.entity';

declare global {
  namespace Express {
    interface User extends UserEntity {}
  }
}
