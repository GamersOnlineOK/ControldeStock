// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Users from './pages/Users'
import Pedidos from './pages/Pedidos'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Reportes from './pages/Reportes'
import './estilos/App.css'
import CrearProducto from './pages/CrearProducto'
import CrearReceta from './pages/CrearReceta'
import PedidosCrear from './pages/pedidos/PedidosCrear';
import PedidosCompletos from './pages/pedidos/PedidosCompletos';
import PedidosPendientes from './pages/pedidos/PedidosPendientes';
import PedidosVer from './pages/pedidos/PedidosVer';
import CrearProveedores from './pages/configuracion/CrearProveedores';
import CreaCategorias from './pages/configuracion/creaCategorias';


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pedidos" element={<Pedidos />} />
        {/* ======= PRODUCTOS ======== */}
        <Route path="/productos/stock" element={<Productos />} />
        <Route path="/productos/crear-producto" element={<CrearProducto />} />
        <Route path="/productos/recetas/:Id" element={<CrearReceta />} />
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
        <Route path="/users" element={<Users />} />
        {/* ============== CONFIGURACION ============== */}
        <Route path="/configuracion/proveedores" element={<CrearProveedores />} />
        <Route path="/configuracion/categorias" element={<CreaCategorias />} />


        
        <Route path="*" element={
          <div className="page">
            <h1>404 - Página No Encontrada</h1>
            <p>La página que buscas no existe.</p>
          </div>
        } />
      </Routes>
    </Layout>
  )
}

export default App