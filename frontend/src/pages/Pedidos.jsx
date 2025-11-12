import PedidosPendientes from "./pedidos/PedidosPendientes";
import { ModalNotificacionesProvider } from "../components/modals/notificaciones/ModalNotificacionesProvider";
import ModalNotificaciones from "../components/modals/notificaciones/ModalNotificaciones";

// src/pages/Pedidos.jsx
function Pedidos() {
  return (
    <div className="page">
      <h1>Gestión de asd Pedidos</h1>
      <p>Página para gestionar todos los pedidos del sistema.</p>
      <ModalNotificacionesProvider>
        <PedidosPendientes key='pedidos-pendientes'/>
        <ModalNotificaciones/>
      </ModalNotificacionesProvider>
    </div>
  )
}

export default Pedidos