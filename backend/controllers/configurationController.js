import Category from "../models/categories.js";

const createCategory = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        const newCategory = new Category({ name, description, isActive });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { createCategory, getCategories };
