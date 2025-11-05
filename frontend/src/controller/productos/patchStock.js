
const patchStock = async (id, stockQuantity) =>{

    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "quantity": parseFloat(stockQuantity),
  "type": "ENTRADA",
  "reference": "Incremento de stock manual",
  "notes": "Ingres",
  "user": "Leonardo"
});

const requestOptions = {
  method: "PATCH",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch(`http://localhost:3200/api/products/${id}/stock`, requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

}

export default patchStock;