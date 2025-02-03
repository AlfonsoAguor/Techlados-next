import { Category } from "../../../models/Categories";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  const isAdmin = await isAdminRequest(req, res);

  if (method === "GET"){
    try {
        const categories = res.json(await Category.find().populate('parent'));

    } catch (error) {
        console.error('Error con la consulta de la categoria:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  if (method === "POST") {
    try {
        const { name, parentCategory, properties } = req.body;
        const categoryDoc = await Category.create({name, parent: parentCategory || null, properties: properties});
    
        res.json(categoryDoc);
    } catch (error) {
        console.error('Error al crear la categoria:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  if (method === "PUT") {
    const { name, parentCategory, _id, properties } = req.body;
    const updatedCategory = await Category.updateOne({_id}, {name, parent: parentCategory || null, properties: properties});

    res.json(updatedCategory);
  }

  if (method === "DELETE") {
    const {_id, parent} = req.body;
    
    await Category.deleteOne({ _id: _id});
    await Category.deleteMany({parent: _id});
    res.json(true);
  }

}
