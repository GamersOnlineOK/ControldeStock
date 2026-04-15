import React from "react";
import URL from "../../utils/apiUrl";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BajaProducto = () => {
    const _ID = useParams().id;
    const [data, setData] = useState({});
    const [quantity, setQuantity] = useState(0);
    const [type, setType] = useState("");
    const [notes, setNotes] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
         fetch(`${URL}products/${_ID}`)
           .then((response) => response.json())
           .then((data) => {
               setData(data);
           })
           .catch((error) => {
             console.log(error);
           });
    }, [_ID]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const quantity = formData.get('quantity');
        const type = formData.get('reference');
        const notes = formData.get('notes');

        const response = await fetch(`${URL}products/${_ID}/stock/reducir`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({
                quantity,
                type:type.toUpperCase(),
                reference:"BAJA DE STOCK",
                notes,
                user: "Leonardo"
            })
        });
        const result = await response.json();

        if (response.ok) {
            navigate(0);
        } else {
            console.log('Error al reducir el stock');
        }
    };

   return (
       <div className="form-container">
        <div className="form-header">
                <h1>{data.name}</h1>
        </div>
        <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-grid">   
                <div className="form-group">
                    <label htmlFor="code">Código:</label>
                    <input type="text" id="code" name="code" defaultValue={data.code} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="currentStock">Stock Actual:</label>
                    <input type="number" id="currentStock" name="currentStock" defaultValue={data.currentStock} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Cantidad a dar de baja:</label>
                    <input type="number" id="quantity" name="quantity" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="reference">Referencia:</label>
                    <select id="reference" name="reference" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Seleccione una referencia</option>
                        <option value="Venta">Venta</option>
                        <option value="Devolución">Devolución</option>
                        <option value="Merma">Mermas</option>
                        <option value="Donación">Donación</option>
                        <option value="Pérdida">Pérdida</option>
                        <option value="Consumo Interno">Consumo Interno</option>
                        <option value="Ajuste Negativo">Ajuste Negativo</option>
                    </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notas adicionales:</label>
              <input type="text" id="notes" name="notes" placeholder="Notas adicionales (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <button className="btn btn-primary">Confirmar Baja</button>
           </form>
           
       </div>
   );
};


export default BajaProducto;
