// models/Product.js
import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  code: {    type: String,    required: true,    unique: true  },
  woocommerceId: {    type: Number,    unique: true,    sparse: true  },
  name: {    type: String,    required: true  },
  description: String,  
  type: {    type: String,    enum: ['MP', 'MPE', 'PF'],    required: true  },
  unit: {    type: String,    required: true  },
  minStock: {    type: Number,    default: 0  },
  maxStock: {    type: Number,    default: 0  },
  currentStock: {    type: Number,    default: 0  },
  cost: {    type: Number,    default: 0  },
  price: {    type: Number,    default: 0  },
  category: {    type: mongoose.Schema.Types.ObjectId,    ref: 'Category',    required: true  },
  isActive: {    type: Boolean,    default: true  }
}, {
  timestamps: true
});
const modelo = mongoose.model('Product', productSchema);
export default modelo