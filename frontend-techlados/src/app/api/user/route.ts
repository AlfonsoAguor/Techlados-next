import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { getUserModel } from "@/models/user";

import { authMiddleware } from "@/middleware/auth";

import fs from "fs";
import path from "path";
import bcrypt from 'bcryptjs';

export async function DELETE(req: Request) {
    const { id } = await req.json();
    const User = await getUserModel();

    try {
        const deletedUser = await User.findByIdAndDelete(id).exec();
        if (deletedUser && deletedUser.avatar === "default.png") {
            return NextResponse.json({ message: "success"});
        } else {
            const avatar = deletedUser.avatar;
            const avatarPath = path.join(process.cwd(), "public/avatars/" + avatar);
            fs.unlink(avatarPath, (err) => {
                if (err) throw err;
        });
            console.log(avatar);
            return NextResponse.json({ message: "success"});
        }
    } catch (error: any) {
        return NextResponse.json({ message: "Error al eliminar el usuario"}, {status: 400});
    }
}

export async function PUT(req: Request) {
    const User = await getUserModel();
    const {id, name, surname, typeUpdate, oldPassword, newPassword, confirmPassword} = await req.json();

    try {
        const authResult = await authMiddleware(req, {id: id});

        if("success" in authResult && authResult?.success){
            
            if(typeUpdate === "user") {
                // Actualizacion del usuario
                if (!name || name.length < 3 ) return NextResponse.json({ message: "El nombre debe de contener minimo 3 caracteres"}, {status: 400});
                const userUpdated = await User.findByIdAndUpdate(
                    id, 
                    { name: name, surname: surname }, 
                    { new: true }
                ).exec();
                if (userUpdated) return NextResponse.json({ user: userUpdated}, {status: 200});
            } else{
                // Actualzacion de la contraseña
                const userFound = await User.findById(id).select("+password");
                const isMatch = await bcrypt.compare(oldPassword, userFound.password);
                if(!isMatch) return NextResponse.json({ message: "Introduzca la contraseña antigua correctamente"}, {status: 400});
                
                if(!newPassword || newPassword.length < 6 ) return NextResponse.json({ message: "Contraseña debe de contener minimo 6 caracteres" },{ status: 409} );
                if(newPassword !== confirmPassword) return NextResponse.json({ message: "La contraseña con coincide"}, {status: 400});

                const passHashed = await bcrypt.hash(newPassword, 12);
                const passUpdated = await User.findByIdAndUpdate(
                    id,
                    {password: passHashed}
                );

                return NextResponse.json({status: 200});
            }
          
        } else {
          return authResult;
        }

    } catch (error: any) {
        if (error.name === 'ValidationError') { 
            const message = Object.values(error.errors).map((err: any) => err.message);

            return NextResponse.json({ message: message}, {status: 400});
        }

        return NextResponse.json({ message: "Error al crear el usuario", error: error.message }, { status: 500 });
    }
}