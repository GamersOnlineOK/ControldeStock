import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModalStock } from '../modals/modalProvider';
import getProductos from '../../controller/productos/getProductos';

function TabladeProductos(producto) {   

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [filterType, setFilterType] = useState('PF'); 
    const [filterState, setfilterState] = useState('true');
    const navigate = useNavigate();

    useEffect(() => {
    const fetchData = async () => {
      const productos = await getProductos(null, null, filterType, filterState);
      console.log(productos);
      setData(productos);
        }
        fetchData();
    }, [filterType, filterState]);
    

    
    const ModalStock = useModalStock();

    const handleSearch = (e) => { setSearchTerm(e.target.value); }

    const verReceta = (producto) =>{
      console.log(producto);
      navigate(`/productos/recetas/${producto._id}`)
      
    }
    // Función de filtrado combinado
    const filteredProducts = data.filter(producto => {
      const matchesSearch = producto.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || producto.type === filterType;
      const matchesState = !filterState || producto.isActive.toString() === filterState;
      
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
            <option value="PF">Producto Final</option>
            <option value="MP">Materia Prima</option>
            <option value="MPE">Materia Prima Elaborada</option>
          </select>
        </div>
        <div className="filter-objets">
          <label htmlFor="filter">Filtrar por Estado:</label>
          <select id="filter" value={filterState} onChange={(e) => setfilterState(e.target.value)}>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
        
      </div>
        
        <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>  
              <th>ID</th>
              <th>Nombre</th>
              <th>Unidad</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((producto, index) => (
              <tr key={producto.id}>
                <td className="text">{index +1}</td>
                <td className="text">{producto.name}</td>
                <td className="text">{producto.unit}</td>
                <td className="number">$ {producto.price}</td>
                <td className="number">{producto.currentStock}</td>
                <td className="text">{producto.isActive ? 'Activo' : 'Inactivo'}</td>
                <td>
                  {/* <button className="btn-action view">Editar</button>
                  <button className="btn-action delete">Eliminar</button> */}
                  {producto.type === "MP" ? (
                    <button className="btn-action process" onClick={() => ModalStock.abrirModal(producto)}>Agregar Stock</button>
                    ):(
                      <>
                      <button className="btn-action process" onClick={() => ModalStock.abrirModal(producto)}>Agregar Stock</button>
                      <button className="btn-action process" onClick={() => verReceta(producto)}>Crear Receta</button>
                      </>

                      )}
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      </>
    );
}

export default TabladeProductos;