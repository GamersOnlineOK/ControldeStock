import URL from '../../utils/apiUrl.js';
const patchStock = async (id, stockQuantity,type) =>{

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "quantity": parseFloat(stockQuantity),
    "type": "PRODUCCION",
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
  console.log(URL);
  
  console.log(type);
  if (type === 'MPE' || type === 'PF') {
    console.log('estoy aca');
    
    fetch(`${URL}products/${id}/stock/elaborada`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => { return error; });

  } else {
    console.log('estoy aca 2');
    
    fetch(`${URL}products/${id}/stock`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

}

export default patchStock;