import PedidosPendientes from "./pedidos/PedidosPendientes";
import { ModalNotificacionesProvider } from "../components/modals/notificaciones/ModalNotificacionesProvider";
import ModalNotificaciones from "../components/modals/notificaciones/ModalNotificaciones";

// src/pages/Pedidos.jsx
function Pedidos() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Gestión de Pedidos</h1>
          <p>Gestiona los pedidos desde Aca.</p>
        </div>
        <div>
          
        </div>
        
      </div>
      
      <ModalNotificacionesProvider>
        <PedidosPendientes key='pedidos-pendientes'/>
        <ModalNotificaciones/>
      </ModalNotificacionesProvider>
    </div>
  )
}

export default Pedidos