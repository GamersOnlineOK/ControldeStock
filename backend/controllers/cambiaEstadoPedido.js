import WooCommerce from '../config/woocommerce.js'
import Order from '../models/pedidos.js';
const cambiaEstadoPedido =  (estado) =>{

    const data = {
        status:estado.estado
    };
    const ordenId= estado.id;
    console.log(data);
    console.log(WooCommerce);
    
    const estadoWoo = () =>{
       WooCommerce.put(`orders/${ordenId}`, data)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error.response.data);
        }); 
    }
    const estadoMongo = async () =>{
        try {
            const pedido = await Order.findOneAndUpdate({orderNumber:ordenId},
                {
                    ...data,
                    ultimaActualizacion: new Date()
                },
                {
                    new:true, runValidators:true
                }
            );

            if (!pedido) {
            throw new Error('Usuario no encontrado');

            }
            
            console.log('Usuario actualizado:', pedido);
            return pedido;

        } catch (error) {
            console.error('Error al actualizar:', error);
            throw error;
        }

    }

    estadoWoo();
    estadoMongo()
    


}
export default cambiaEstadoPedido