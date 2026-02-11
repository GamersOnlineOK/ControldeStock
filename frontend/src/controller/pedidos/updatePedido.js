import URL from '../../utils/apiUrl.js';
const updatePedido = async (pedidoId,  updateData) => {

    console.log('Actualizar pedido:'+pedidoId , updateData);
    try {
        const response = await fetch(`${URL}orders/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: updateData
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el pedido');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en updatePedido:', error);
        throw error;
    }
};
export default updatePedido;