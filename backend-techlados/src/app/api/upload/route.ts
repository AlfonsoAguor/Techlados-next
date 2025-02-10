import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";
import User from "@/models/user";

export const POST = async (req: any, res: any) => {
  const formData = await req.formData();
  const userId = formData.get("userId");
  const oldAvatar = formData.get("oldAvatar");

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
  
  try {
    await writeFile(
      path.join(process.cwd(), "public/avatars/" + uniqueName),
      buffer
    );

    if(oldAvatar !== "default.png"){

      const filePath = path.join(process.cwd(), "public/avatars/", oldAvatar);

      fs.unlink(filePath, (err) =>
        NextResponse.json({message: "No se ha encontrado el archivo", err},{status: 500})
      )
      
    }

    const userUpdated = await User.findByIdAndUpdate(
      userId,
      { avatar: uniqueName},
      { new: true}
    ).exec();

    return NextResponse.json({ Message: "Avatar actualizado correctamente", status: 201 });
  } catch (error: any) {
      if (error.name === 'ValidationError') { 
        const message = Object.values(error.errors).map((err: any) => err.message);

        return NextResponse.json({ message: message}, {status: 400});
    }
    return NextResponse.json({ Message: "Ha habido algun error", status: 500 });
  }
};