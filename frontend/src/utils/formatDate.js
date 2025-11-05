function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return dateString; // Devuelve la cadena original si no es una fecha válida
  }
    const options = { 
      weekday:'long',
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
    };
    return date.toLocaleDateString('es-AR', options);
  }
export default formatDate;