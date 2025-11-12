import { createContext, useContext, useState } from "react";

// Creo el  contexto para el provider de notificaciones
export const ModalNotificacionesContext = createContext();
export const ModalNotificacionesProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [opciones, setOpciones] = useState({});
    const abrirModal = (notificacionData, opcionesData = {}) => {
    setNotificacion(notificacionData);
    setOpciones(opcionesData);
    setShowModal(true);
  }
    const cerrarModal = () => {
    setShowModal(false);
    setNotificacion(null);
    setOpciones({});
  }
    return (
    <ModalNotificacionesContext.Provider value={{
      showModal,
      notificacion,
        opciones,
        abrirModal,
        cerrarModal
    }}>
        {children}
    </ModalNotificacionesContext.Provider>
    )
};
export const useModalNotificaciones = () => {
  const context = useContext(ModalNotificacionesContext);
    if (!context) {
    throw new Error('useModalNotificaciones debe ser usado dentro de ModalNotificacionesProvider');
    }
    return context;
};