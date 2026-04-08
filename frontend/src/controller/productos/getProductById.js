
import URL from '../../utils/apiUrl.js';
const getProductById = async (id) => {
    try {
        const response = await fetch(`${URL}products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener el producto');
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error en getProductById:', error);
        return null;
    }
};

export default getProductById;