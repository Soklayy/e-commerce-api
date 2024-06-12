import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import * as path from 'path';

export const storage = {
  storage: diskStorage({
    destination: 'public/image',
    filename: (req, file, cb) => {
      const filename: string = randomUUID();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};
