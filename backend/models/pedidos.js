import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  orderNumber: { type: Number, required: true, unique: true },
  user: {email: String },
  items: [{
    productId: Number,
    nombre: String,
    quantity: Number,
    subtotal:Number
  }],
  notes:  {Type:String},
  status: { type: String, default: 'Pendiente' },
  createdAt: { type: Date, default: Date.now },
  
},{collection: 'OrdenesPendientes'});

const Order = mongoose.model('Order', orderSchema);

export default Order;