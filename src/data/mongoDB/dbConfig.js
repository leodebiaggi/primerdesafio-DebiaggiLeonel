import mongoose from 'mongoose'
import dotenv from 'dotenv'; 
dotenv.config(); 

//CONFIG MONGOOSE
const URI = process.env.MONGO_URL;
mongoose.connect(URI)
.then(()=> console.log('conectado a la base de datos'))
.catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
});