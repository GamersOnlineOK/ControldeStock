// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import getPedidos from '../controller/getPedidosPendientes';
import  formatDate  from '../utils/formatDate';
import enviarPedido from '../controller/pedidos/enviaProcesar';
import { Link } from 'react-router-dom';
import URL from '../utils/apiUrl';
import getIncomingOrders from '../controller/pedidos/getIncomingOrders';

function Home() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  console.log(URL);
  
  useEffect(() => {

    async function fetchPedidosPendientes() {
      const pendingOrders = await getIncomingOrders();
      if (pendingOrders) {
        const data = await getPedidos()
        setPedidos(data)
        setLoading(false)
      }
    }
    fetchPedidosPendientes()
  }, []);

  const pedidosPendientes = pedidos.filter(p => p.status === 'Pendiente').length
  const pedidosCompletados = pedidos.filter(p => p.status === 'completed').length
  
  const totalVentas = pedidos.reduce((sum, pedido) => 
    sum + (pedido.items?.reduce((sumLineas, linea) => 
      sumLineas + ((parseFloat(linea.subtotal)*linea.quantity )|| 0), 0
    ) || 0), 0
    );

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Actualizando pedidos...</div>
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
    </div>
  )
}

export default Home