import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';

import productRoute from './src/routes/product'
import productCateRoute from './src/routes/productCate'
import ingreCateRoute from './src/routes/ingreCate'
import ingredientRoute from './src/routes/ingredient'
import productSizeRoute from './src/routes/productSize'

const app = express();

const server = http.createServer(app);
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/api/product', productRoute)
app.use('/api/category', productCateRoute)
app.use('/api/ingre-category', ingreCateRoute)
app.use('/api/ingredient', ingredientRoute)
app.use('/api/product', productSizeRoute)

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Database connected'))
    .catch(() => console.log('Connect database failed'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});