import URL from "../../utils/apiUrl"

const getIncomingOrders = async () => {
    try {
        const response = await fetch(`${URL}orders/incoming`, {
            method: 'GET',
            headers: {  
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los pedidos entrantes');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getIncomingOrders:', error);
        throw error;
    }
};
export default getIncomingOrders;