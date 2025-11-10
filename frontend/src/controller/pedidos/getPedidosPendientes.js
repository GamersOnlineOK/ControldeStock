import URL from '../../utils/apiUrl.js';
const getPendidosPendientes = async () => {
    
    try {
        const response = await fetch(`${URL}orders/pendientes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los pedidos pendientes');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getPendidosPendientes:', error);
        throw error;
    }
};
export default getPendidosPendientes;