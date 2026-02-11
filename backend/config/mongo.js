import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const con = async (app,PORT) =>{
    console.log(process.env.MONGODB_URI);
    
    const coneccion = await mongoose.connect(process.env.MONGODB_URI, )
    .then(() => {
        console.log('Conectado a la basse de datos Mongo');
    }).catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

    const createServer = await app.listen(PORT, () => {
    console.log(`Server escuchando en http://localhost:${PORT}`);
    });
    return {coneccion, createServer};
}

export default con;

