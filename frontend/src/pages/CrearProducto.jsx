import React, { useEffect, useState } from 'react';
import '../estilos/formularios.css';
import postProducto from '../controller/productos/postProducto';

function CrearProducto(props) {

    
    
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'PF',
    unit: '',
    minStock: '',
    currentStock: '',
    categoria: '',
    price: '',
    precioVenta: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del producto:', formData);
    postProducto(formData)
    // Aquí iría la lógica para enviar los datos al servidor
    alert('Producto guardado correctamente');
  };

  const handleReset = () => {
    setFormData({
      code: '',
      name: '',
      type: 'PF',
      unit: '',
      minStock: '',
      currentStock: '',
      categoria: '',
      precioCompra: '',
      precioVenta: ''
    });
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Cargar Producto</h1>
        <p>Complete todos los campos para agregar un nuevo producto al inventario</p>
      </div>
      
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
            {/* Tipo de Producto */}
            <div className="form-group">
            <label htmlFor="type">Tipo de Producto</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una unidad</option>
              <option value="MP">Materia Prima</option>
              <option value="MPE">Materia Prima Elaborada</option>
              <option value="PF">Prodcuto Final</option>
            </select>
            </div>
            {/* codigo de Producto */}
            <div className="form-group">
                <label htmlFor="code">Código del Producto</label>
                <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Ej: PROD-001"
                required
                />
            </div>
            {/* Nombre del Producto */}
            <div className="form-group">
                <label htmlFor="name">Nombre del Producto</label>
                <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Torta de Chocolate"
                required
                />
            </div>
          
          <div className="form-group">
            <label htmlFor="unit">Unidad de Medida</label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una unidad</option>
              <option value="gramos">Gramos</option>
              {/* <option value="Unidad">Unidad </option> */}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="minStock">Stock Mínimo</label>
            <input
              type="number"
              id="minStock"
              name="minStock"
              value={formData.minStock}
              onChange={handleChange}
              min="0"
              placeholder="Ej: 10"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="currentStock">Stock Actual</label>
            <input
              type="number"
              id="currentStock"
              name="currentStock"
              value={formData.currentStock}
              onChange={handleChange}
              min="0"
              placeholder="Ej: 50"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="Empanadas">Empanadas</option>
              <option value="Facturas">Facturas</option>
              <option value="Galletitas y Otros">Galletitas y Otros</option>
              <option value="Materia Prima">Materia Prima</option>
              <option value="Pan Dulce">Pan Dulce</option>
              <option value="Panaderia">Panaderia</option>
              <option value="Pasta Frolas">Pasta Frolas</option>
              <option value="Pasteleria">Pasteleria</option>
              <option value="Pizzeria">Pizzeria</option>
              <option value="Tortas y Postres">Tortas y Postres</option>
              
            </select>
            
          </div>
          
          <div className="form-group full-width">
            <label>Precios</label>
            <div className="price-row">
              <div className="price-input">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.precioCompra}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Precio de Compra"
                  required
                />
              </div>
              <div className="price-input">
                <input
                  type="number"
                  id="precioVenta"
                  name="precioVenta"
                  value={formData.precioVenta}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Precio de Venta"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Limpiar
          </button>
          <button type="submit" className="btn btn-primary">
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
    // <>
    // <div className="form-header">
    //      <h1>Cargar Producto</h1>
    //      <p>Complete todos los campos para agregar un nuevo producto al inventario</p>
    // </div>
    // </>
  );
}

export default CrearProducto;