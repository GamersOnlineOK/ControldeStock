import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    description: { type: String },
    isActive: { 
        type: Boolean, 
        default: true
    }
}, {
    collection: 'Categories',
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);

export default Category;