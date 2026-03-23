import { useModalStock } from "./modalProvider";
import '../../estilos/modal.css'
import patchStock from "../../controller/productos/patchStock";

const ModalAgregarStock = () => {
  const {
    showModal,
    selectedProduct,
    stockQuantity,
    setStockQuantity,
    cerrarModal
  } = useModalStock();


  if (!showModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stockQuantity && selectedProduct) {
      // Aquí llamas a tu función original para agregar stock
      // agregarStock(selectedProduct._id, stockQuantity);
      console.log('Agregando stock:', selectedProduct._id, stockQuantity);

      const id= selectedProduct._id;
      const type = selectedProduct.type;
      console.log(id,stockQuantity,type);

      const patch = patchStock(id,stockQuantity,type );
      console.log(patch);
      
      try {
        const response = patch.then(res => {
          console.log('Respuesta del servidor:', res);
          if (res.ok) {
            alert('Stock agregado exitosamente');
          } else {
            alert('Error al agregar stock');
          }
        }).catch(error => {
          console.error('Error en la solicitud:', error);
          alert('Error al agregar stock');
        });
      } catch (error) {
        console.error(error);
        alert('Error al agregar stock');
      }
      

      cerrarModal();
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
              <button type="button" className="btn-cancel" onClick={cerrarModal}>
                Cancelar
              </button>
              <button type="submit" className="btn-confirm">
                Agregar Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarStock;