import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function editarProducto() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducto = async () => {
            const data = await getProductoById(id);
            setProducto(data);
        };
        fetchProducto();
    }, [id]);

    const handleUpdate = async (updatedProducto) => {
        // Lógica para actualizar el producto
        navigate(`/productos/${id}`);
    };

    if (!producto) return <div>Cargando...</div>;

    return (
        <div>
            <h1>Editar Producto</h1>
            <FormularioProducto producto={producto} onUpdate={handleUpdate} />
        </div>
    );
}

export default editarProducto;