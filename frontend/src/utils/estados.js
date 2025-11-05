const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Pendiente': return '#f39c12'
      case 'en_proceso': return '#3498db'
      case 'completed': return '#27ae60'
      case 'cancelado': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  const getEstadoTexto = (estado) => {
    switch(estado) {
      case 'Pendiente': return 'Pendiente'
      case 'en_proceso': return 'En Proceso'
      case 'completed': return 'Completado'
      case 'cancelado': return 'Cancelado'
      default: return estado
    }
  }

  export { getEstadoColor, getEstadoTexto };