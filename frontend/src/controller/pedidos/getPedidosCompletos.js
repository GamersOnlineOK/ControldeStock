const getPendidosCompletos = async () => {
    try {
        const response = await fetch('http://localhost:3200/api/orders/completados', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los pedidos completos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getPendidosCompletos:', error);
        throw error;
    }
};
export default getPendidosCompletos;