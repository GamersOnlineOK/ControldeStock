import { redirect, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import getPendidosPendientes from '../../controller/pedidos/getPedidosPendientes';
import updatePedido from '../../controller/pedidos/updatePedido';


function PedidosVer(props) {

    const { id } = useParams();
    const [pedido, setPedido] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);

     useEffect(() => {

        setLoading(true);
        async function fetchPedidosPendientes() {
            const data = await getPendidosPendientes();
            const productoEncontrado = data.find(p => p._id === id);
            setPedido(productoEncontrado);
            setLoading(false);
        }
        fetchPedidosPendientes();
    }, [id]);

    const handleInputChange = (value) => {
    setQuantities(prev => ({
      ...prev,
      "quantiti": parseInt(value) || 0,
    }));
    };
    const putUpdatePedido = async (productoID) => {
        // Lógica para actualizar el pedido
        const updateData = JSON.stringify({
            "items": [
                {
                "productId": productoID,
                "quantity": quantities.quantiti
                }
            ]
            });
        const response = await updatePedido(pedido._id, updateData);
        console.log('Respuesta de la actualización:', response);
        setPedido(response.order);
        
    }

    return (
        <div>
            
            {pedido && <>

            <h1>{pedido.user}</h1>
            {/* <div>Pedido ID: {pedido._id}</div> */}
            <div>Nota: {pedido.notes}</div>
            <div>Estado: {pedido.status}</div>
            <div>Fecha: {new Date(pedido.createdAt).toLocaleString()}</div>
            <h2>Productos:</h2>
                {loading ? <p>Cargando productos...</p> :

                <table className="orders-table" key={pedido._id}>
                        <thead>
                            <tr>
                                <th>Producto ID</th>
                                <th>Nombre</th>
                                <th>Cantidad Pedida</th>
                                <th>Cantidad Nueva</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                        {pedido.items.map((producto, index) => (
                            
                                
                                    <tr key={index}>
                                        <td>{producto.productId}</td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.quantity}</td>
                                        <td>
                                            <input 
                                            defaultValue={producto.quantity}
                                            onChange={(e) => handleInputChange(e.target.value)}
                                            ></input>
                                        </td>
                                        <td>
                                            <button className="btn-action process" onClick={()=> putUpdatePedido(producto.productId)}>Actualizar</button>
                                        </td>
                                    </tr>
                                
                            
                        ))}
                        </tbody>
                </table>
                }
            
            </>
            }
        </div>
    );
}

export default PedidosVer;