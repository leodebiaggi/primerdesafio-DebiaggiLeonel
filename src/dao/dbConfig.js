import mongoose from 'mongoose'

//CONFIG MONGOOSE
const URI = 'mongodb+srv://leodebiaggi:Complot2019@ecommercestor3d.910i2dj.mongodb.net/ECOMMERCESTOR3D?retryWrites=true&w=majority'
mongoose.connect(URI)
.then(()=> console.log('conectado a la base de datos'))
.catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
});