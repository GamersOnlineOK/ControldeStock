// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import '../estilos/Navbar.css'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-brand">
        {/* <Link to="/">📦 Goweb - </Link> */}
        <h4 >Panificadora Baresi 🍞</h4>
        <p>Sistema de control de stock de mercaderia</p>
      </div>
      
      <ul className="nav-links">
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            🏠 Dashboard
          </Link>
        </li>

        {/* PEDIDOS */}

        <li className="dropdown">
          <Link 
            to="/pedidos" 
            className={location.pathname === '/pedidos' ? 'active' : ''}
          >
            📋 Pedidos
          </Link>
            <ul className="dropdown-menu">
              <li>
                <Link to="/pedidos/crear-pedido"
                className={location.pathname === '/productos/electronica' ? 'active' : ''}
                >                
                🛒 Crear Pedido</Link>
              </li>
              <li>
                <Link to="/pedidos/pedidos-pendientes">🟡 Pedidos Pendientes</Link>
              </li>
              <li>
                <Link to="/pedidos/pedidos-completados">✅  Pedidos Completos</Link>
              </li>
              
            </ul>
        </li>

        {/* PRODUCTOS */}

        <li className="dropdown">
          <Link 
            // to="/productos" 
            className={location.pathname === '/productos' || location.pathname === '/productos/stock' || location.pathname === '/productos/crear-producto' ? 'active' : '' }
          >
            📦 Productos
          </Link>
            <ul className="dropdown-menu">
              <li>
                <Link to="/productos/crear-producto"
                className={location.pathname === '/productos/electronica' ? 'active' : ''}
                >
                
                🏷️ Crear Producto
                </Link>
              </li>
              <li>
                <Link to="/productos/stock">📋 Stock de Productos
                </Link>
              </li>
            </ul>
        </li>
        
        <li>
          <Link 
            to="/clientes" 
            className={location.pathname === '/clientes' ? 'active' : ''}
          >
            👥 Clientes
          </Link>
        </li>
        <li>
          <Link 
            to="/reportes" 
            className={location.pathname === '/reportes' ? 'active' : ''}
          >
            📊 Reportes
          </Link>
        </li>
        <li className="dropdown">
          <Link 
            className={location.pathname.startsWith('/configuracion/') ? 'active' : ''}
          >
            🛠️ Configuracion
          </Link>
          <ul className="dropdown-menu">
            <li>
              <Link to="/configuracion/proveedores">🤝 Proveedores</Link>
            </li>
            <li>
              <Link to="/configuracion/otra-opcion">⚙️ Otra Opción</Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar