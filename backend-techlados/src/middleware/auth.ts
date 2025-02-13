import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// MIDDLEWARE DE AUTENTICACION PARA EL API

export async function authMiddleware(req: Request, { id }: { id: any }) {

    try {

    //Sesion del usuario
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "No autorizado. Debes estar autenticado." },
        { status: 401 }
      );
    }

    // Si el middleware recibe un id, se valida y se comprueban permisos
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: "El ID proporcionado no es válido." },
          { status: 400 }
        );
      }
      
      // Verificamos que el id de la sesión coincide con el id proporcionado
      if (session.user?.id !== id) {
        console.log("error");
        return NextResponse.json(
          { message: "No tienes permiso para realizar esta acción." },
          { status: 403 }
        );
      }
    }

    // Devolvemos la session y un success
    return {session, success: true};

    } catch (error) {
        console.error("Error en authMiddleware:", error);
        return NextResponse.json(
            { message: "Error interno del servidor." },
            { status: 500 }
        );
    }
}