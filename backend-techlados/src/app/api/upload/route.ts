import { NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink } from "fs/promises";


export const POST = async (req: any, res: any) => {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ message: "No hay archivos" }, { status: 400 });
    }
  
    const buffer = Buffer.from(await file.arrayBuffer());
  
    const MaxFile = 5 * 1024 * 1024;
    if (file.size > MaxFile) {
      return NextResponse.json({ message: "Max 5 MB" }, { status: 400 });
    }
  
    const allowedExt = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedExt.includes(file.type)) {
      return NextResponse.json({ message: "Extensión incorrecta" }, { status: 400 });
    }
  
    const filename =  file.name.replaceAll(" ", "_");
    const uniqueName = `${Date.now()}_${filename}`;

    await writeFile(
      path.join(process.cwd(), "public/uploads/" + uniqueName),
      buffer
    );

    return NextResponse.json({ Message: "Avatar actualizado correctamente", files: uniqueName, status: 201 });
  } catch (error: any) {
      if (error.name === 'ValidationError') { 
        const message = Object.values(error.errors).map((err: any) => err.message);

        return NextResponse.json({ message: message}, {status: 400});
    }
    return NextResponse.json({ Message: "Ha habido algun error", status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const body = await req.json();
    const file = body.file;

    const filePath = path.join(process.cwd(), "public", "uploads", file);

    await unlink(filePath)

    return NextResponse.json({ status: 200, message: "Imagen eliminada" });
  } catch (err) {
    return NextResponse.json({ status: 500, message: "Error al eliminar imagen", error: err });
  }
};
