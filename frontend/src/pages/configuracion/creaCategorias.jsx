import URL from "../../utils/apiUrl";
import { 
    useState,
    useEffect
} from "react";
import { useNavigate } from "react-router-dom";


function CreaCategorias(props) {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [editingCategoria, setEditingCategoria] = useState({name: '', description: ''});
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

    const editarCategoria = (categoria) => {
        
        fetch(`${URL}config/update/${categoria._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoria)  
        })
        .then(response => response.json())
        .then(result => {
            console.log('Categoria actualizada:', result);
            // Aquí podrías actualizar la lista de categorías o mostrar un mensaje de éxito
            setCategorias(prevCategorias => prevCategorias.map(cat => cat._id === result._id ? result : cat));
            //actualizar la pagina
            setEditingCategoria(null);
            navigate('/configuracion/categorias');
        }
        )
        .catch(error => console.error('Error updating category:', error));
    }


    return (
        <>
        <div className="receta-container">
                <div className="receta--sub--container">                
                        <form onSubmit={crearCategoria} >
                            <div className="receta--group--item">
                                <label htmlFor="nombre">Nombre de la Categoria:</label>
                                <input type="text" id="nombre" name="nombre" required />
                            </div> 
                            <div className="receta--group--item">                            
                                <label htmlFor="descripcion">Descripción:</label>
                                <input type="text" id="descripcion" name="descripcion" required />
                            </div>
                            <div className="receta--group--item">
                                <button className="btn btn-primary" type="submit">Crear Categoria</button>
                            </div>                        
                        </form>                
                </div>
        <div className="receta--sub--container">
            <h2>Listado de Categorias</h2>
            {/* aca va el listado de categorias */}
            <table  className="ingredients-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                    <tbody >
                        {categorias.map((categoria) => (
                            <tr key={categoria._id}>
                                <td>
                                    <input type="text" id="nombre" name="nombre" required 
                                    value={categoria.name}
                                    onChange={(e) => {
                                        const categoriasActualizadas = categorias.map(cat =>
                                            cat._id === categoria._id
                                                ? {...cat, name: e.target.value}
                                                : cat
                                        );
                                        setCategorias(categoriasActualizadas);
                                    }}
                                    />
                                </td>
                                <td>
                                    <input type="text" id="descripcion" name="descripcion" required 
                                    value={categoria.description}
                                    onChange={(e) => {
                                        const categoriasActualizadas = categorias.map(cat =>
                                            cat._id === categoria._id
                                                ? {...cat, description: e.target.value}
                                                : cat
                                        );                                       
                                        setCategorias(categoriasActualizadas);
                                    }}
                                    />
                                </td>
                                <td>
                                    <button className="btn-action edit" onClick={() => editarCategoria(categoria)}>Guardar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
        </div>
        </>
    );
}

export default CreaCategorias;
