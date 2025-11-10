import URL from '../../utils/apiUrl.js';
const postReceta = (components, Id) => {
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "components": 
    components
  ,
  "version": "1.0"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

return fetch(`${URL}bom/${Id}`, requestOptions)
  .then((response) => response.text())
  .then((result) => {console.log(result);return result})
  .catch((error) => console.error(error));
}
export default postReceta;