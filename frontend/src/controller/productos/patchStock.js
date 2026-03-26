import URL from '../../utils/apiUrl.js';

const patchStock = async (id, stockQuantity, type) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "quantity": parseFloat(stockQuantity),
    "type": "PRODUCCION",
    "reference": "Incremento de stock manual",
    "notes": "Ingreso",
    "user": "Leonardo"
  });

  const raw2 = JSON.stringify({
    "quantity": parseFloat(stockQuantity),
    "type": "ENTRADA",
    "reference": "Incremento de stock manual",
    "notes": "Ingreso",
    "user": "Leonardo"
  });

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  const requestOptions2 = {
    method: "PATCH",
    headers: myHeaders,
    body: raw2,
    redirect: "follow"
  };

  try {
    if (type === 'MPE' || type === 'PF') {
      const response = await fetch(`${URL}products/${id}/stock/elaborada`, requestOptions);
      const result = await response.json();
      return result;
    } else {
      const response = await fetch(`${URL}products/${id}/stock`, requestOptions2);
      const result = await response.json();
      return result;
    }
  } catch (error) {
    throw error; // O puedes retornar un objeto de error personalizado
  }
};

export default patchStock;