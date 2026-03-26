// models/BOM.js
import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    set: function(value) {
      return Math.round(value * 10000) / 10000;
    }
  },
  waste: {
    type: Number,
    default: 0,
    min: 0
  }
});

const bomSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  components: [componentSchema],
  version: {
    type: String,
    default: '1.0'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  baseQuantity: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

// Índice para búsquedas eficientes
bomSchema.index({ product: 1, isActive: 1 });
const BOM = mongoose.model('BOM', bomSchema);
export default BOM