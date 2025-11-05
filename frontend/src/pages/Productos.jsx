// src/pages/Productos.jsx
import { useState, useEffect } from "react"
import getProductos from "../controller/productos/getProductos"
import { ModalStockProvider, useModalStock } from "../components/modals/modalProvider";
import ModalAgregarStock from "../components/modals/ModalAgregarStock";
import TabladeProductos from "../components/productos/TabladeProductos";
function Productos() {

  

  return (
    
    <div className="recent-orders">
      <div className="page">
        <h1>Gestión de Productos</h1>
        <p>Página para gestionar el inventario de productos.</p>
      </div>
      <ModalStockProvider>
        <TabladeProductos key='Productos'/>
        <ModalAgregarStock /> 
      </ModalStockProvider>
    </div>
  )
}

export default Productos