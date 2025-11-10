import URL from '../utils/apiUrl.js';
const getPedidosPendientes = async () => {
    try {
        const response = await fetch(`${URL}orders/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los pedidos pendientes');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en getPedidosPendientes:', error);
        return [];
    }
};

export default getPedidosPendientes;