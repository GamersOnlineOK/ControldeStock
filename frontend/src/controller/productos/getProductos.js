
const getProductos = async (req, res, type, active) => {
    try {
        const response = await fetch(`http://localhost:3200/api/products/?type=${type}&active=${active}`, {
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

export default getProductos;