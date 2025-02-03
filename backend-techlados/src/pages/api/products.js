import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "../../../models/Product";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    const isAdmin = await isAdminRequest(req, res);

    if(method == 'GET'){
        try {
            /*Buscar producto unico */
            if (req.query?.id){
                res.json(await Product.findOne({_id: req.query.id}));
            } else {
                res.json(await Product.find());
            }
        } catch (error) {
            console.error('Error al crear el producto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    if(method == 'POST'){
        try {
            const {title,description,price,images,category,brand,properties} = req.body;
            
            const productDoc = await Product.create({
                title,description,price,images,category,brand,properties
            });
    
            res.json(productDoc);
        } catch (error) {
            
            console.error('Error al crear el producto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    if(method == 'PUT'){
        try {
            const {title,description,price, _id, images, category, brand, properties} = req.body;

           await Product.updateOne({_id}, {title, description, price, images, brand, category,properties});
           res.json(true);

        } catch (error) {
            console.error('Error al crear el producto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    if(method == 'DELETE'){
        try {
            if(req.query?.id){
                await Product.deleteOne({ _id: req.query?.id});
                res.json(true);
            }

        } catch (error) {
            console.error('Error al crear el producto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}