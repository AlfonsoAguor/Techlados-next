"use client"
import { FormEvent, useState, useEffect } from "react";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordToggleIcon from "@/components/PasswordToggleIcon";

function LoginPage() {
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setShowMessage(false);

    const signinRes = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false
    });

    if (signinRes?.error) {
      setError(signinRes.error as string);
      setShowMessage(true);
    }
  };

  useEffect(() => {
    if(session) {
      router.push('/');
    }
  }, [session, router]);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);
      return () => clearTimeout(timer); 
    }
  }, [showMessage]);

  return (
    <div className="bg-gray-900 h-screen flex flex-col justify-center items-center">
      <div className="w-11/12 sm:w-2/3 lg:w-1/4 bg-slate-800 p-8 rounded-md relative">
        <form onSubmit={handleSubmit}>
          {showMessage && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[-5rem] bg-red-500 text-white p-2 mb-2 rounded-md text-center">
              {error}
            </div>
          )}
          <h1 className="pb-6 text-2xl text-center text-white">Inicio de sesión</h1>
          <input type="email" placeholder="Correo" name="email" autoComplete="email" className="mb-4 px-4 py-2 w-full rounded-md" />

          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña" 
              name="password"
              autoComplete="current-password"
              className="mb-4 px-4 py-2 w-full rounded-md" 
            />

            <button
              type="button"
              className="absolute right-3 top-2 text-gray-600"
              onClick={() => setShowPassword(prev => !prev)}
            >
              <PasswordToggleIcon isPasswordVisible={showPassword} colorIcon="white"/>
            </button>
          </div>

          <button className="px-4 py-2 mt-2 w-full rounded-md font-bold shadow-lg bg-indigo-400 text-white hover:bg-indigo-500 duration-300">
            Iniciar
          </button>
        </form>
        <div className="border-decoration my-6"></div>

        <div className="">
          <p className="text-white text-center pb-2"> Iniciar sesión con google</p>
          <button className="flex flex-row bg-white p-2 text-black px-4 rounded-lg w-full items-center justify-center gap-2" onClick={() => signIn("google")}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Google
          </button>
        </div>

        <div className="flex mt-8 text-white">
          <p>¿No tienes cuenta?</p>
          <Link href={"/register"} className="ml-auto underline text-indigo-400">Registrate</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
