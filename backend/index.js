import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import con from './config/mongo.js';
import routes from './routes/index.js';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3201;
const defaultOrigins = [
  'https://simi-pry.com.ar',
  'http://simi-pry.com.ar',
  'https://www.simi-pry.com.ar',
  'http://www.simi-pry.com.ar',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// RUTAS
app.use('/api', routes);

//CONECCION A LA BASE DE DATOS Y SERVIDOR
con(app, PORT)
