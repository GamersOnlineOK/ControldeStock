import URL from '../../utils/apiUrl.js';
const postProducto = (producto) =>{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(producto);

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    fetch(`${URL}products/`, requestOptions)
    .then((response) => {
        return {
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            data: response.json()
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

export default postProducto;