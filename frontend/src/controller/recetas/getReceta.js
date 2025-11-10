import URL from '../../utils/apiUrl.js';
const getReceta = (req, res,recetaId) => {
    // Lógica para obtener la receta por ID
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
    };

    return fetch(`${URL}bom/${recetaId}/explosion`, requestOptions)
    .then((response) => response.text())
    .then((result) => {return result})
    .catch((error) => console.error(error));
};
export default getReceta;