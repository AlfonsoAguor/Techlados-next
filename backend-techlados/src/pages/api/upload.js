import multiparty from "multiparty";
import fs from "fs";
import path from "path";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  await mongooseConnect();
  const isAdmin = await isAdminRequest(req, res);

  const form = new multiparty.Form();

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePaths = [];
    for (const file of files.file) {
      const tempPath = file.path;
      const originalName = file.originalFilename;

      //const uniqueName = `${Date.now()}-${originalName}`;
      const newPath = path.join(uploadDir, originalName);

      fs.renameSync(tempPath, newPath);
      filePaths.push(`/uploads/${originalName}`);
    }

    res.json({ message: "Archivos subidos correctamente", filePaths });
  } catch (error) {
    console.error("Error al guardar las imágenes:", error);
    res.status(500).json({ error: "No se pudieron guardar las imágenes" });
  }
}

export const config = {
  api: { bodyParser: false },
};
