import mongoose from 'mongoose';
import './env.js';
import { seedSuperAdmin } from './seedSuperAdmin.js';
const con = async (app,PORT) =>{
    if (!process.env.MONGODB_URI) {
        throw new Error('Falta configurar MONGODB_URI');
    }
    
    const coneccion = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a la basse de datos Mongo');
    await seedSuperAdmin();

    const createServer = await app.listen(PORT, () => {
    console.log(`Server escuchando en http://localhost:${PORT}`);
    });
    return {coneccion, createServer};
}

export default con;

