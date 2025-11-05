import { createContext, useContext, useState } from 'react';

// Crear el contexto
const ModalStockContext = createContext();

// Proveedor del contexto
export const ModalStockProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockQuantity, setStockQuantity] = useState('');

  const abrirModal = (producto) => {
    console.log('Abriendo modal para:', producto);
    setSelectedProduct(producto);
    setShowModal(true);
    setStockQuantity('');
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setStockQuantity('');
  };

  const resetearCantidad = () => {
    setStockQuantity('');
  };

  return (
    <ModalStockContext.Provider value={{
      showModal,
      selectedProduct,
      stockQuantity,
      setStockQuantity,
      abrirModal,
      cerrarModal,
      resetearCantidad
    }}>
      {children}
    </ModalStockContext.Provider>
  );
};

// Hook personalizado
export const useModalStock = () => {
  const context = useContext(ModalStockContext);
  if (!context) {
    throw new Error('useModalStock debe ser usado dentro de ModalStockProvider');
  }
  return context;
};