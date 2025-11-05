import React, { useEffect, useState } from 'react';
import getAllProductos from '../controller/productos/getAllProductos';
import postReceta from '../controller/recetas/postReceta';
import { useParams } from 'react-router-dom';
import '../estilos/recetas.css';
import '../estilos/formularios.css'
import getReceta from '../controller/recetas/getReceta';

function CrearReceta(props) {

    const {Id} = useParams();
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [data, setData] = useState([])
    const [materiaprima, setMateriaPrima] = useState('')
    const [producto, setProducto] = useState([])
    const [type, setType ] = useState('MP');
    const [componente, setComponente] = useState('');
    const [componentes,setComponentes] = useState([])
    const active = true;

    useEffect(()=>{
            const fetchProductos = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const productos = await getAllProductos(null,null,type, active);                        
                    setData(productos);
                    if (Array.isArray(productos)) {
                        const materiasPrimas = productos.filter(pd => pd.type === type);                        
                        setMateriaPrima(materiasPrimas);
                    }
                    
                } catch (error) {
                    setError(error.message || 'Error al traer Productos');
                    console.error('Error en fetchProductos:', error);
                    setData([])
                } finally {
                    setLoading(false);
                }
            };

            fetchProductos();
        },[type])
    useEffect(() => {
        
        const fetchReceta = async () =>{
            try {
                const res = await getReceta(null,null,Id);
                const rs = JSON.parse(res);
                console.log(rs);
                
                const CRs= rs.components.map(component => ({
                        ingrediente: component.product._id, // Solo el ID
                        ing:{name:component.product.name} ,
                        cantidad: component.product.quantity,
                        waste: component.waste || 0 // Por si no viene waste
                    }))
                ;
                console.log(CRs);
                setComponentes(CRs)
                
            } catch (error) {
                console.log(error);
            }
        }
        fetchReceta();
    }, [Id]);

    const handleChangeType = (e) =>{
        const {value} = e.target; 
        const ty = value ;      
        setType(ty)
    }
    const handleComponent = (e) =>{
        const {name,value} =e.target;
        
        const selectedIng = ()=>{
            if (name == 'ingrediente') {
            return materiaprima.find(mp => mp._id === value);
            }
        };
        const ing = selectedIng()
        if (ing != undefined) {
           setComponente((pre) =>{
            return {
                ...pre,
                [name]:value,
                ing
            } 
            }) 
        }
        setComponente((pre) =>{
            return {
                ...pre,
                [name]:value,
            } 
            }) 
    }

    useEffect( () =>{
            const fetchIdPd = () =>{
                const PF = data.filter(pd => pd._id === Id); 
                setProducto(PF)
                }
         fetchIdPd();
    },[data])
       
    const addIngrediente = (event) => {
        event.preventDefault();        
        
        setComponentes(prevComponentes => {
            const componenteExiste = prevComponentes.some(comp => 
                comp.ingrediente === componente.ingrediente
            );
            
            if (componenteExiste) {
                // Actualizar el componente existente
                return prevComponentes.map(comp => 
                    comp.ingrediente === componente.ingrediente
                        ? { ...comp, cantidad: componente.cantidad }
                        : comp
                );
            } else {
                // Agregar nuevo componente
                return [...prevComponentes, componente];
            }
        });

        event.target.reset();       
    }
    

    const enviarReceta = () => {
        const component = []
        const receta = () =>{
            componentes.map(c => {
                component.push({
                    product: c.ingrediente,
                    quantity: c.cantidad
                })
            })

        }
        receta()
        postReceta(component, Id).then(respuesta => {
                console.log('Respuesta capturada:', respuesta);
                alert('Receta actualizada con exito');
            })
            .catch(error => {
                console.error('Error capturado:', error);
            });
    }
    // =================================================
    const eliminarIngrediente = (ingredienteId) => {
        setComponentes(prevComponentes =>
            prevComponentes.filter(comp => comp.ingrediente !== ingredienteId)
        );
        enviarReceta();
        
    }    
    console.log(componentes);
    
    
    return (
        <>
        <div className='receta-container'>
            {/* Muestra ingredientes a cargar */}
            <div className='receta--sub--container'>
                <div>
                    <h3 className='text-left'>Producto</h3>
                    {producto.length >0 ? (
                        <h2>{producto[0].name}</h2>
                    ):(
                        <h2>buscando Producto</h2>
                    )}
                </div>
                <div>
                    <h3 className='text-left'>Receta</h3>
                    <form onSubmit={addIngrediente}>
                        <div className='receta--group--item'>
                            <label>Tipo de Ingrediente:</label>
                            <select 
                                type="text"
                                name="tipo"
                                // value={FormDataType.type}
                                onChange={handleChangeType}
                                >
                                <option value={'MP'}>
                                    Materia Prima
                                </option>
                                <option value={'MPE'}>
                                    Materia Prima Elaborada
                                </option>
                            </select>
                        </div>
                        <div className='receta-group'>
                            <div className='receta--group--item'>
                                <label>Ingrediente:</label>
                                <select
                                    type="text"
                                    name="ingrediente"
                                    onChange={handleComponent}
                                    >
                                        <option selected> Selecciona un ingrediente </option>
                                    {
                                            loading ? ("ok"):(
                                                materiaprima.map((mp) => {
                                                return <option value={mp._id}>{mp.name}</option>
                                            }))
                                    }
                                </select>
                            </div>
                            <div className='receta--group--item'>
                                <label>Cantidad en gramos:</label>
                                <input
                                    type="number"
                                    name="cantidad"
                                    onChange={handleComponent}
                                ></input>
                            </div> 
                        </div>
                        <div>
                            <button className='btn'>Agregar</button>
                        </div>
                    </form> 
                </div>
                
            </div>
            {/* Listado de Ingredientes cargados para enviar receta */}
            <div className='receta--sub--container'>
                                    {
                                        componentes.length > 0 ? (
                                        <>
                                            <h2>Listado de Ingredientes</h2>
                                            <table className="ingredients-table">
                                                <thead>
                                                    <tr>
                                                        <th>Nombre del Ingrediente</th>
                                                        <th>Cantidad</th>
                                                        <th>Opciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {componentes.map(c => (
                                                    <tr key={c.ingrediente}>
                                                        <td>{c.ing.name}</td>
                                                        <td>{c.cantidad}</td>
                                                        <td>
                                                            <button onClick={()=>{eliminarIngrediente(c.ingrediente)}} className='btn-action delete'>Eliminar</button>
                                                        </td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <button className='btn-action process' onClick={enviarReceta}>Enviar Receta</button>
                                        </>
                                        ):(
                                            <h3>Selecciona ingredientes de la Lista</h3>
                                        )
                                    }
            </div> 
        </div>
        </>
        
    );
}

export default CrearReceta;