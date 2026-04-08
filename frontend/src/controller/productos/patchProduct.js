import URL from "../../utils/apiUrl";

const patchProducto = async (id, updatedData) => {
    console.log(id,updatedData);
    
    try {
        const response = await fetch(`${URL}products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el producto');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en patchProducto:', error);
        throw error;
    }
};

export default patchProducto;
