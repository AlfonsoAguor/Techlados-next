import { mongooseConnect } from "@/lib/mongoose";
import { Brand } from "../../../models/Brand";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Product } from "../../../models/Product";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    const isAdmin = await isAdminRequest(req, res);

    if(method == 'GET'){
        try {
            if(req.query?.id){
                const brandDoc = await Brand.findOne({_id: req.query.id});
                res.status(200).json(brandDoc);
            }else{ 
                const brandData = await Brand.find();
                res.status(200).json(brandData);
            }
        } catch (error) {
            console.error('Error al crear el marca:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    if(method == 'POST'){
        const {name, categories} = req.body;
        try {
            const brandDoc = new Brand({name, categories});
            const saveBrand = await brandDoc.save();

            const populatedBrand = await Brand.findById(brandDoc._id).populate({path: "categories", select: "name"});

            res.status(201).json(populatedBrand);

        } catch (error) {
            console.error('Error al crear el marca:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    if(method == 'PUT'){
        const { name, categories, _id } = req.body;
        
        try {
            const updatedBrand = await Brand.updateOne({_id}, {name, categories});
            res.status(201).json(updatedBrand);
        } catch (error) {
            console.error('Error al crear el marca:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    if(method == 'DELETE'){
        const data = req.body;
        try {
            if(data){
                await Brand.deleteOne({ _id: data});
                res.status(200).json(true);
            }
        } catch (error) {
            console.error('Error al crear el marca:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}