import URL from '../../utils/apiUrl.js';

const getOrdersSummary = async () => {
  const response = await fetch(`${URL}orders/summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el resumen de pedidos');
  }

  return response.json();
};

export default getOrdersSummary;
