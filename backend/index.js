import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import con from './config/mongo.js';
import routes from './routes/index.js';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// RUTAS
app.use('/api', routes);

//CONECCION A LA BASE DE DATOS Y SERVIDOR
con(app, PORT)