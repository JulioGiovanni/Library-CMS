import multer from 'multer';
import path from 'path'; //Para usar las rutas de archivos
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); //Para obtener el nombre del archivo
const __dirname = path.dirname(__filename); //Para obtener el directorio del archivo

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'),
  filename: (req, file, cb) => {
    const name = file.originalname.split('.');
    cb(null, name[0] + '-' + path.extname(file.originalname));
  },
});

//Método para subir imágenes
export const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      const name = file.originalname.split('.');

      return cb(
        null,
        name[0] + '-' + path.extname(file.originalname)
      );
    }
    cb('Error: Archivo no válido');
  },
  dest: path.join(__dirname, '../public/uploads'),
});
