import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getPendidosPendientes from '../../controller/pedidos/getPedidosPendientes';
import formatDate from '../../utils/formatDate';
import {getEstadoColor, getEstadoTexto} from '../../utils/estados';
import enviarPedido from '../../controller/pedidos/enviaProcesar';

function PedidosPendientes(props) {
  const navigate =  useNavigate();
    const [pedidos, setPedidos] = useState([]);
    useEffect(() => {
        // pedidos pendintes
        async function fetchPedidosPendientes() {
            const data = await getPendidosPendientes();
            setPedidos(data);
        }   
        fetchPedidosPendientes();
    }, []);

    const procesarPedido = async (pedido) => {
        try {
          const resultado = await enviarPedido(pedido);
          if (resultado.success) {
            console.log("Que bien");
            
          }
          
          alert('Pedido procesado: ' + JSON.stringify(resultado));
        } catch (error) {
          alert('Error al procesar el pedido: ' + error.message);
        }
      }
    const verPedido = (pedido) => {
      navigate(`/pedidos/ver/${pedido._id}`);
    }
    return (
        <>
        <div>
            Pedidos Pendientes
        </div>
        <div>
            <div className="recent-orders">
              <h2>Pedidos Recientes</h2>

              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Nota</th>
                      <th className='columna-color'>Fecha</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido, index) => (
                      
                      <tr key={pedido.id}>
                        <td> {index +1}</td>
                        <td>{pedido.user}</td>
                        <td>{pedido.notes}</td>
                        <td>{formatDate(pedido.createdAt)}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getEstadoColor(pedido.status) }}
                          >
                            {getEstadoTexto(pedido.status)}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action process" onClick={()=>procesarPedido(pedido)}>Procesar</button>
                          <button className="btn-action view" onClick={() =>verPedido(pedido)}>Ver</button>
                          <button className="btn-action edit" >Editar</button>
                          
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pedidos.length === 0 && (
                <div className="no-orders">
                  <p>No hay pedidos registrados.</p>
                  <button className="btn-primary">Crear Primer Pedido</button>
                </div>
              )}
            </div>
        </div>
        </>
        
    );
}

export default PedidosPendientes;