import stock from "../models/StockMovement.js";

const getStockMovements = async (req, res) => {
    try {
        const movements = await stock.find().populate('product').sort({ createdAt: -1 });
        res.json(movements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const movement = await stock.findById(req.params.id).populate('product');
        if (!movement) {
            return res.status(404).json({ error: 'Stock movement not found' });
        }
        res.json(movement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  

export default {
    getStockMovements,
    getById
};