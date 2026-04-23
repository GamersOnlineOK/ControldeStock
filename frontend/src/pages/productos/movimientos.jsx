import { useEffect, useState } from "react";
import getMovimientos from "../../controller/movimientos/getMovements.js";
import redondeo from "../../utils/redondeo.js";

function movimientos(props) {

        const [searchTerm, setSearchTerm] = useState('');
        const [data, setData] = useState([]);
        const [filterType, setFilterType] = useState('PRODUCCION'); 
        const [filterState, setfilterState] = useState(() => {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}`;
                });
        const tipoProduccion = ['ENTRADA', 'SALIDA', 'AJUSTE', 'PRODUCCION', 'CONSUMO','VENTA', 'DEVOLUCIÓN', 'MERMA', 'DONACIÓN', 'PÉRDIDA', 'CONSUMO INTERNO', 'AJUSTE_POSITIVO', 'AJUSTE NEGATIVO'];

        useEffect(() => {
            const fetchData = async () => {
                const movimientos = await getMovimientos();
                setData(movimientos);
            };
            fetchData();
        }, [ filterType, filterState]);

        const handleSearch = (e) => { setSearchTerm(e.target.value); }

        const filteredProducts = data.filter(item => {
            console.log(item);
            // aca tengo que modificar la logica del filtro de productos.
            // por que hay movimientos que no tienen producto asociado, entonces tengo que hacer una condicion para que no tire error al querer acceder a item.product.name
            const matchesSearch = item.product && item.product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === '' || item.type === filterType;
           const matchesState = filterState === '' || new Date(item.createdAt).toLocaleDateString('en-CA') === filterState; // Aquí puedes ajustar la lógica de filtrado por fecha según tus necesidades
            return matchesSearch && matchesType && matchesState;
        });

    return (
        <>
        <div className="filter-group">
        <div className="filter-objets">
          <label>Buscar</label>
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="filter-objets">
          <label htmlFor="filter">Filtrar por tipo:</label>
          <select id="filter" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            {tipoProduccion.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        {/* aca tengo que armar un filtro de fecha por rango*/}
        <div className="filter-objets">
            <label htmlFor="filter">Filtrar por fecha:</label>
            <input type="date" id="start-date" name="start-date" onChange={(e) => setfilterState(e.target.value)} />
        </div>
        
      </div>
        
        <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>  
              <th>ID</th>
              <th>Movimiento</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Descripcion</th>
              <th>stock Previo</th>
              <th>Consumo</th>
              <th>Stock actual</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((producto, index) => (
              <tr key={producto.id}>
                <td className="text">{index +1}</td>
                <td className="text">{producto.type}</td>
                {
                    producto.product ? (
                        <td className="text">{producto.product.name}</td>
                    ) : (

                        <td className="text ">Sin producto Asociado</td>
                    )}
                {producto.product ? (
                    <td className="text">{producto.product.type}</td>
                ) : (
                    <td className="text">Sin unidad</td>
                )}
                <td className="text">{producto.notes}</td>
                <td className="">{producto.previousStock}</td>
                <td className="">{producto.quantity}</td>
                <td className="">{producto.newStock}</td>
                <td className="text">{new Date(producto.createdAt).toLocaleString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</td>

              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      </>
    );
}

export default movimientos;