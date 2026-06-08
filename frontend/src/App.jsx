// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Users from './pages/Users'
import Login from './pages/Login'
import Pedidos from './pages/Pedidos'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Reportes from './pages/Reportes'
import './estilos/App.css'
import CrearProducto from './pages/CrearProducto'
import CrearReceta from './pages/CrearReceta'
import PedidosCrear from './pages/pedidos/PedidosCrear';
import PedidosCompletos from './pages/pedidos/PedidosCompletos';
import PedidosVer from './pages/pedidos/PedidosVer';
import CrearProveedores from './pages/configuracion/CrearProveedores';
import CreaCategorias from './pages/configuracion/creaCategorias';
import EditarProducto from './pages/productos/editarProducto';
import BajaProducto from './pages/productos/bajaProducto';
import Movimientos from './pages/productos/movimientos';

function ProtectedApp() {
  return (
    <ProtectedRoute>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pedidos" element={<Pedidos />} />

          {/* ======= PRODUCTOS ======== */}
          <Route path="/productos/stock" element={<Productos />} />
          <Route path="/productos/crear-producto" element={<CrearProducto />} />
          <Route path="/productos/recetas/:Id" element={<CrearReceta />} />
          <Route path="/productos/editar/:id" element={<EditarProducto />} />
          <Route path="/productos/baja/:id" element={<BajaProducto />} />
          <Route path="/productos/movimientos" element={<Movimientos />} />

          {/* ======= PEDIDOS ======== */}
          <Route path="/pedidos/crear-pedido" element={<PedidosCrear />} />
          <Route path="/pedidos/pedidos-completados" element={<PedidosCompletos />} />
          <Route path="/pedidos/pedidos-pendientes" element={<Pedidos />} />
          <Route path="/pedidos/ver/:id" element={<PedidosVer />} />

          {/* ======= OTROS ======== */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/users" element={
            <ProtectedRoute roles={['superadmin', 'admin']}>
              <Users />
            </ProtectedRoute>
          } />

          {/* ============== CONFIGURACION ============== */}
          <Route path="/configuracion/proveedores" element={<CrearProveedores />} />
          <Route path="/configuracion/categorias" element={<CreaCategorias />} />

          <Route path="*" element={
            <div className="page">
              <h1>404 - Pagina No Encontrada</h1>
              <p>La pagina que buscas no existe.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedApp />} />
    </Routes>
  )
}

export default App
