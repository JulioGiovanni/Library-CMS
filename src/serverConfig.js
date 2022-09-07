//Importaciones
import express from 'express'; //Express framework
import path from 'path'; //Para usar las rutas de archivos
import { fileURLToPath } from 'url';
import morgan from 'morgan'; //Para ver las peticiones

const __filename = fileURLToPath(import.meta.url); //Para obtener el nombre del archivo

const __dirname = path.dirname(__filename); //Para obtener el directorio del archivo

// import './database.js';
import router from './routes/books.routes.js';
import router2 from './routes/user.routes.js';
import router3 from './routes/auth.routes.js';

//Instancia del servidor
const app = express(); //Esto inicia el servidor y lo iguala a la variable app

//Configuraciones
app.use(morgan('dev')); //Para ver las peticiones que se hacen
app.set('port', process.env.PORT || 3000); //Puerto, si existe uno en el entorno de desarrollo, si no, 3000
app.use(express.urlencoded({ extended: true })); //Para que se puedan enviar datos por formularios
app.use(express.static('public')); //Para que se puedan usar archivos estaticos
app.use('public', express.static(path.join(__dirname, 'public'))); //Para que se puedan usar archivos estaticos

app.use('/', router); //Para que se puedan usar las rutas
// Middlewares
app.use(express.urlencoded({ extended: false }));

app.use('/', router); //Para que se puedan usar las rutas
app.use('/', router2); //Para que se puedan usar las rutas
app.use('/', router3); //Para que se puedan usar las rutas

export default app; //Exportamos la variable app para usarla en nuestro server.js
