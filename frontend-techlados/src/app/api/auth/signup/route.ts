import { getUserModel } from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const User = await getUserModel();
  const {email, password, confirmPassword, name, surname} = await req.json();
  
    try {
        const emailFound = await User.findOne({ email });
        if(emailFound) return NextResponse.json({ message: "El correo ya esta registrado" },{ status: 409} );

        if(!password || password.length < 6 ) return NextResponse.json({ message: "Contraseña debe de contener minimo 6 caracteres" },{ status: 409} );
        if(password !== confirmPassword) return NextResponse.json({ message: "Las constraseñas no coinciden" },{ status: 409} );

        const passHashed = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            surname,
            email,
            password: passHashed,
        });

        const savedUser = await user.save();

        if (savedUser) return NextResponse.json({ email: savedUser.email },{ status: 201 });

    } catch (error: any) {

        if (error.name === 'ValidationError') { 
            const message = Object.values(error.errors).map((err: any) => err.message);

            return NextResponse.json({ message: message}, {status: 400});
        }

        return NextResponse.json({ message: "Error al crear el usuario", error: error.message }, { status: 500 });
    }

}
