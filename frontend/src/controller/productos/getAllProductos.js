import URL from '../../utils/apiUrl.js';
const getAllProductos = async (req, res, type, active) => {
    try {
        const response = await fetch(`${URL}products/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }); 

        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error en getProductos:', error);
        return [];
    }
};

export default getAllProductos;