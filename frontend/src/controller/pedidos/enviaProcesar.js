import URL from '../../utils/apiUrl.js';

const postPedidosProcesar = async (pedido) => {
    
    console.log('Enviando pedido para procesar:', pedido);
    
    try {
        const response = await fetch(`${URL}orders/process-sequential`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });
        if (!response.ok) {
            throw new Error('Error al procesar el pedido');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en postPedidosProcesar:', error);
        throw error;
    }
};
export default postPedidosProcesar;