import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'

// export class FileStorage {
//     const storage = diskStorage({
//         destination: (req, file, callback) => {
//           const user = req['user'];
//           const application = req['application'];
//           const destination = `./files/${user.email}/${application.id}`;
//           fs.mkdirSync(destination);
//           callback(null, destination);
//         },
//         filename: (req, file, callback) => {
//           const uniqueSuffix = Date.now() + '-' + uuidv4();
//           const extension = extname(file.originalname);
//           callback(null, `${uniqueSuffix}__${extension}`);
//         },
//       });
// }