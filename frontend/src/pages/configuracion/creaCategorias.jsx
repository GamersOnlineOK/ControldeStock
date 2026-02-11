import URL from "../../utils/apiUrl";
import { 
    useState,
    useEffect
} from "react";

function CreaCategorias(props) {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        fetch(`${URL}config/list`)
            .then(
                response => response.json())
            .then(data => setCategorias(data))
            .catch(error => console.error('Error fetching categories:', error));
        }, []);
    
    const crearCategoria = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('nombre'),
            description: formData.get('descripcion')
        };
        fetch(`${URL}config/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Categoria creada:', result);
            // Aquí podrías actualizar la lista de categorías o mostrar un mensaje de éxito
            setCategorias(prevCategorias => [...prevCategorias, result]);
        }
        )
        .catch(error => console.error('Error creating category:', error));
    }



    return (
        <>
        <div className="form-container">
            <div >
                <div className="form-header">
                    <form onSubmit={crearCategoria}>
                        <label htmlFor="nombre">Nombre de la Categoria:</label>
                        <input type="text" id="nombre" name="nombre" required />
                        <br />
                        <label htmlFor="descripcion">Descripción:</label>
                        <input type="text" id="descripcion" name="descripcion" required />
                        <br />
                        <button className="btn btn-primary" type="submit">Crear Categoria</button>
                    </form>
                </div>
            </div>
            <div>
                Aca se listan las categorias
            </div>
        </div>
        <div style={{ width: '50%', margin: '0 auto' }}>
            <h2>Listado de Categorias</h2>
            {/* aca va el listado de categorias */}
            <table  className="ingredients-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                {categorias.map((categoria) => (
                    <tbody key={categoria._id}>
                        <tr>
                            <td>{categoria.name}</td>
                            <td>{categoria.description}</td>
                        </tr>
                    </tbody>
                    
                ))}
                </table>
        </div>
        
        </>
    );
}

export default CreaCategorias;
