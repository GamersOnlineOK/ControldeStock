// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../estilos/Navbar.css'

const icons = {
  brand: '\u{1F35E}',
  dashboard: '\u{1F3E0}',
  pedidos: '\u{1F4CB}',
  crearPedido: '\u{1F6D2}',
  pendientes: '\u{1F7E1}',
  completos: '\u{2705}',
  productos: '\u{1F4E6}',
  crearProducto: '\u{1F3F7}\u{FE0F}',
  clientes: '\u{1F465}',
  reportes: '\u{1F4CA}',
  configuracion: '\u{1F6E0}\u{FE0F}',
  usuarios: '\u{1F464}',
  proveedores: '\u{1F91D}',
  categorias: '\u{2699}\u{FE0F}',
}

function NavIcon({ icon }) {
  return <span className="nav-icon" aria-hidden="true">{icon}</span>
}

function Navbar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const canManageUsers = user && ['superadmin', 'admin'].includes(user.role)

  const roleLabel = user?.role === 'superadmin'
    ? 'Superadmin'
    : user?.role === 'admin'
      ? 'Administrador'
      : 'Usuario'

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h4>Panificadora Baresi <NavIcon icon={icons.brand} /></h4>
        <p>Sistema de control de stock de mercaderia</p>
      </div>

      <ul className="nav-links">
        <li>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            <NavIcon icon={icons.dashboard} />Dashboard
          </Link>
        </li>

        <li className="dropdown">
          <Link
            to="/pedidos"
            className={location.pathname === '/pedidos' ? 'active' : ''}
          >
            <NavIcon icon={icons.pedidos} />Pedidos
          </Link>
          <ul className="dropdown-menu">
            <li>
              <Link to="/pedidos/crear-pedido">
                <NavIcon icon={icons.crearPedido} />Crear Pedido
              </Link>
            </li>
            <li>
              <Link to="/pedidos/pedidos-pendientes">
                <NavIcon icon={icons.pendientes} />Pedidos Pendientes
              </Link>
            </li>
            <li>
              <Link to="/pedidos/pedidos-completados">
                <NavIcon icon={icons.completos} />Pedidos Completos
              </Link>
            </li>
          </ul>
        </li>

        <li className="dropdown">
          <Link
            className={location.pathname === '/productos' || location.pathname === '/productos/stock' || location.pathname === '/productos/crear-producto' ? 'active' : ''}
          >
            <NavIcon icon={icons.productos} />Productos
          </Link>
          <ul className="dropdown-menu">
            <li>
              <Link to="/productos/crear-producto">
                <NavIcon icon={icons.crearProducto} />Crear Producto
              </Link>
            </li>
            <li>
              <Link to="/productos/stock">
                <NavIcon icon={icons.pedidos} />Stock de Productos
              </Link>
            </li>
            <li>
              <Link to="/productos/movimientos">Movimientos de Stock</Link>
            </li>
          </ul>
        </li>

        <li>
          <Link
            to="/clientes"
            className={location.pathname === '/clientes' ? 'active' : ''}
          >
            <NavIcon icon={icons.clientes} />Clientes
          </Link>
        </li>
        <li>
          <Link
            to="/reportes"
            className={location.pathname === '/reportes' ? 'active' : ''}
          >
            <NavIcon icon={icons.reportes} />Reportes
          </Link>
        </li>
        <li className="dropdown">
          <Link
            className={location.pathname.startsWith('/configuracion/') || location.pathname === '/users' ? 'active' : ''}
          >
            <NavIcon icon={icons.configuracion} />Configuracion
          </Link>
          <ul className="dropdown-menu">
            {canManageUsers && (
              <li>
                <Link to="/users">
                  <NavIcon icon={icons.usuarios} />Usuarios
                </Link>
              </li>
            )}
            <li>
              <Link to="/configuracion/proveedores">
                <NavIcon icon={icons.proveedores} />Proveedores
              </Link>
            </li>
            <li>
              <Link to="/configuracion/categorias">
                <NavIcon icon={icons.categorias} />Crear Categoria
              </Link>
            </li>
          </ul>
        </li>
      </ul>

      {user && (
        <div className="nav-session">
          <span>{user.username}</span>
          <small>{roleLabel}</small>
          <button type="button" onClick={logout}>Salir</button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
