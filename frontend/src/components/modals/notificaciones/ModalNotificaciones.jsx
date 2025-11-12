import { useModalNotificaciones } from "./ModalNotificacionesProvider";
import '../../../estilos/modal.css';

function ModalNotificaciones() {
  const {
    showModal,
    notificacion,
    opciones,
    cerrarModal
  } = useModalNotificaciones();
    if (!showModal) return null;
    return (
    <div className="modal-overlay" onClick={cerrarModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
            <h2>{notificacion?.message || 'Procesando Pedido'}</h2>
            <button className="modal-close" onClick={cerrarModal}>×</button>
        </div>
        <div className="modal-body">
            <p>Pedido N°: {notificacion?.orderNumber || '...Cargando'}</p>
            <ol>
            {notificacion?.errors && notificacion.errors.map((detalle, index) => (
                <li key={index}> <p><span>{detalle.error} </span>- {detalle.item.nombre}</p></li>
            ))}
            </ol>
            {opciones?.mostrarCerrar && (
            <button className="btn-primary" onClick={cerrarModal}>
                Cerrar
            </button>
            )}
        </div>
        </div>
    </div>
    );
}
export default ModalNotificaciones;