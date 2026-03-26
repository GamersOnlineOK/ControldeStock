const redondear= (valor) => {
    // Redondear a 2 decimales primero para evitar problemas de precisión
    const valorRedondeado = Math.round(valor * 1) / 1;
    
    // Obtener la parte decimal
    const decimal = valorRedondeado - Math.floor(valorRedondeado);
    
    // Si el decimal es menor a 0.02, redondear hacia abajo
    if (decimal < 0.02) {
        return Math.floor(valorRedondeado);
    }
    // Si el decimal es mayor a 0.98, redondear hacia arriba
    else if (decimal > 0.98) {
        return Math.ceil(valorRedondeado);
    }
    // Si no, mantener 2 decimales
    else {
        return valorRedondeado;
    }
};

export default redondear;