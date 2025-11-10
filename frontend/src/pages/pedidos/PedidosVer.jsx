import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import getPendidosPendientes from '../../controller/pedidos/getPedidosPendientes';


function PedidosVer(props) {

    const { id } = useParams();
    const [pedido, setPedido] = useState(null);

     useEffect(() => {
        // Aquí puedes hacer una llamada a la API o buscar en tu array
        async function fetchPedidosPendientes() {
            const data = await getPendidosPendientes();
            const productoEncontrado = data.find(p => p._id === id);
            setPedido(productoEncontrado);
            
        }   
        fetchPedidosPendientes();
    }, [id]);

    const updatePedido = () => {
        // Lógica para actualizar el pedido
        alert('Actualizar pedido no implementado aún.');        
    }
    

    return (
        <div>
            
            {pedido && <>

            <h1>{pedido.user}</h1>
            <div>Pedido ID: {pedido._id}</div>
            <div>Nota: {pedido.notes}</div>
            <div>Estado: {pedido.status}</div>
            <div>Fecha: {new Date(pedido.createdAt).toLocaleString()}</div>
            <h2>Productos:</h2>
                <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Producto ID</th>
                                <th>Nombre</th>
                                <th>Cantidad Pedida</th>
                                <th>Cantidad Nueva</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        {pedido.items.map((producto, index) => (
                            
                                <tbody>
                                    <tr key={index}>
                                        <td>{producto.productId}</td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.quantity}</td>
                                        <td><input defaultValue={producto.quantity}></input></td>
                                        <td>
                                            <button className="btn-action process" onClick={()=> updatePedido()}>Actualizar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            
                        ))}
                </table>
            
            </>
            }
        </div>
    );
}

export default PedidosVer;