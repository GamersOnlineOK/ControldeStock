// models/StockMovement.js
import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['ENTRADA', 'SALIDA', 'AJUSTE', 'PRODUCCION', 'CONSUMO'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  reference: String,
  notes: String,
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Índices para consultas frecuentes
stockMovementSchema.index({ product: 1, createdAt: -1 });
stockMovementSchema.index({ type: 1, createdAt: -1 });

const stock= mongoose.model('StockMovement', stockMovementSchema);
export default stock;