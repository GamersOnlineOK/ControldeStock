import { useModalStock } from "./modalProvider";
import '../../estilos/modal.css'
import patchStock from "../../controller/productos/patchStock";
import { useState } from "react";
import { set } from "mongoose";

const ModalAgregarStock = () => {
  const {
    showModal,
    selectedProduct,
    stockQuantity,
    setStockQuantity,
    cerrarModal
  } = useModalStock();

  const [error, setError] = useState('');

  if (!showModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stockQuantity && selectedProduct) {

      const id = selectedProduct._id;
      const type = selectedProduct.type;

      const patch = await patchStock(id, stockQuantity, type);

      if (patch.error) {
        setError(patch.error);
      } else {
        setError('');
          cerrarModal();
        }
    }
  };

  return (
    <div className="modal-overlay" onClick={cerrarModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agregar Stock</h2>
          <button className="modal-close" onClick={cerrarModal}>×</button>
        </div>
        
        <div className="modal-body">
          <p>
            Producto: <strong>{selectedProduct?.name}</strong>
          </p>
          <p>
            Stock actual: <strong>{selectedProduct?.currentStock}</strong>
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cantidad">Cantidad a agregar:</label>
              <input
                type="number"
                id="cantidad"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                min="1"
                required
                placeholder="Ingrese la cantidad"
              />
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => { cerrarModal(); setError(''); }}>
                Cancelar
              </button>
              <button type="submit" className="btn-confirm">
                Agregar Stock
              </button>
            </div>
          </form>
          <div>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarStock;