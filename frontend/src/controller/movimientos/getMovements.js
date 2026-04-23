import URL from "../../utils/apiUrl";

const getMovements = async () => {
    try {
        const response = await fetch(`${URL}stock-movements`);
        if (!response.ok) {
            throw new Error('Error al obtener los movimientos de stock');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getMovements:', error);
        throw error;
    }
};

export default getMovements;