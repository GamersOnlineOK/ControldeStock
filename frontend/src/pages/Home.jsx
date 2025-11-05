// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import getPedidosPendientes from '../controller/getPedidosPendientes';
import  formatDate  from '../utils/formatDate';
import enviarPedido from '../controller/pedidos/enviaProcesar';
import { Link } from 'react-router-dom';

function Home() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPedidosPendientes() {
      const data = await getPedidosPendientes()
      setPedidos(data)
      setLoading(false)
    }
    fetchPedidosPendientes()
  }, [])
  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Pendiente': return '#f39c12'
      case 'en_proceso': return '#3498db'
      case 'completed': return '#27ae60'
      case 'cancelado': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  const getEstadoTexto = (estado) => {
    switch(estado) {
      case 'Pendiente': return 'Pendiente'
      case 'en_proceso': return 'En Proceso'
      case 'completed': return 'Completado'
      case 'cancelado': return 'Cancelado'
      default: return estado
    }
  }

  const pedidosPendientes = pedidos.filter(p => p.status === 'Pendiente').length
  const pedidosCompletados = pedidos.filter(p => p.status === 'completed').length
  const totalVentas = pedidos.reduce((sum, pedido) => 
    sum + (pedido.items?.reduce((sumLineas, linea) => 
      sumLineas + (parseFloat(linea.subtotal) || 0), 0
    ) || 0), 0
    );
  
  // envia a Procesar pedido
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

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Cargando pedidos...</div>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Dashboard - Control de Stock</h1>
      
      {/* Resumen rápido */}
      <div className="dashboard-stats">
          
            <div className="stat-card">
              <h3>Total Pedidos</h3>
              <p className="stat-number">{pedidos.length}</p>
            </div>
          
          
        
        <Link 
            to="/pedidos/pedidos-pendientes" 
            className={location.pathname === '/pedidos/pedidos-pendientes' ? 'active' : ''}
            >
          <div className="stat-card">
            <h3>Pendientes</h3>
            <p className="stat-number pending">{pedidosPendientes}</p>
          </div>
        </Link>
        <Link 
            to="/pedidos/pedidos-completados" 
            className={location.pathname === '/pedidos/pedidos-completados' ? 'active' : ''}
            >
          <div className="stat-card">
            <h3>Completados</h3>
            <p className="stat-number completed">{pedidosCompletados}</p>
          </div>
        </Link>
        <div className="stat-card">
          <h3>Total Ventas</h3>
          <p className="stat-number sales">${totalVentas.toFixed(2)}</p>
        </div>
      </div>

      {/* Lista de pedidos recientes */}
      {/* <div className="recent-orders">
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
                    <button className="btn-action view">Ver</button>
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
      </div> */}
    </div>
  )
}

export default Home