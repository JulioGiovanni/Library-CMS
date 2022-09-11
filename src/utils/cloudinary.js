import cloudinary from 'cloudinary'; //Para subir imagenes a la nube

//Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(filePath) {
  const result = await cloudinary.v2.uploader.upload(filePath, {
    folder: 'books',
    use_filename: true,
    unique_filename: false,
  });
  return result;
}
