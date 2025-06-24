"use client"

import { FormEvent, useEffect, useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";

import Swal from 'sweetalert2';

import { Center } from '@/components/Center';
import PasswordToggleIcon from '@/components/PasswordToggleIcon';

interface User{
  _id: string,
  name: string,
  surname: string,
}

function SettingsPage(){
  const router = useRouter();
  const { userData, setUserChange, userChange } = useUser();

  const [ error, setError ] = useState();
  const [ showMessage, setShowMessage ] = useState(false);
  const [ name, setName ] = useState(userData?.name || "");
  const [ surname, setSurname ] = useState(userData?.surname || "");
  const [ avatar, setAvatar ] = useState("Seleccione una imagen");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [ showOldPassword, setShowOldPassword ] = useState(false);
  const [ showNewPassword, setShowNewPassword ] = useState(false);

  useEffect(() => {
    if(userData){
      setName(userData?.name || "");
      setSurname(userData?.surname || "");
    }
  }, [userData]);

  const changeSuccess = () => {
    setUserChange(false);
        setTimeout(() => {
          setUserChange(true);
        }, 100);
        router.push('/');
  }

  const uploadImage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Selecionamos el input donde subimos el archivo
    const fileInput = fileInputRef.current;

    if (fileInput && fileInput.files && fileInput.files.length > 0){
      //Si tiene contenido lo metemos en una constante
      const file = fileInput.files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userData?._id || "");
      formData.append("oldAvatar", userData?.avatar || "");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        if(res.ok){
          changeSuccess();
        }

      } catch (error) {
        if(error instanceof AxiosError){
          setError(error.response?.data.message);
          setShowMessage(true);
        }
      }
    }
  }

  const showName = async (e: React.ChangeEvent<HTMLInputElement >) => {
    e.preventDefault();
    const fileInput = fileInputRef.current;

    if (fileInput && fileInput.files && fileInput.files.length > 0){
      const file = fileInput.files[0].name;
      setAvatar(file);
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setShowMessage(false);

    try {
      const updateRes = await axios.put('/api/user', {
        id: userData?._id,
        name: formData.get('name'),
        surname: formData.get('surname'),
        typeUpdate: "user",
      });

      if (updateRes.status === 200) {
        changeSuccess();
      }

    } catch (error) {
      if(error instanceof AxiosError){
        setError(error.response?.data.message);
        setShowMessage(true);
      }
    }
  }

  const handleSubmitPassword = async ( e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setShowMessage(false);

    try {
      const updateRes = await axios.put('/api/user', {
        id: userData?._id,
        oldPassword: formData.get('oldPassword'),
        newPassword: formData.get('newPassword'),
        confirmPassword: formData.get('confirmPassword'),
        typeUpdate: "pass",
      });
      
      if (updateRes.status === 200) {
        changeSuccess();
      }

    } catch (error) {
      if(error instanceof AxiosError){
        setError(error.response?.data.message);
        setShowMessage(true);
      }
    }
  }

  const deleteUser = async() => {
    const result = await Swal.fire({
      title: `¿Quieres eliminar la cuenta?`,
      showDenyButton: true,
      confirmButtonText: "No",
      denyButtonText: "Si, eliminar"
  });

  if (result.isDenied) {
      try {
          const userId = userData?._id;
          await signOut({ redirect: false});
          const result = await axios.delete('/api/user', {data: {id: userId}});
          Swal.fire({title: "Cuenta eliminada correctamente"});
      } catch (error) {
          Swal.fire({title: "No se pudo eliminar la cuenta"});
      }
    }
  }

  useEffect(() => {
    if(showMessage){
      const timer = setTimeout(() => {setShowMessage(false)}, 2000);
      return () => clearTimeout(timer);
    }
  },[error, showMessage]);

  return (
    <Center>
        <h1 className='text-xl sm:text-3xl mt-7 flex justify-center'>Cambiar foto de perfil</h1>
        <div className='flex justify-center mt-8 gap-8 items-center'>
          <div className=''>
            {userData?.avatar === "default.png" ? (
                <img src={'default.png'} alt="User default" className="size-20 md:size-40 rounded-full"/>
              ) : (
                <img src={`/avatars/${userData?.avatar}`} alt="User default" className="size-40 rounded-full" />
              )}
          </div>
          <form onSubmit={uploadImage}>
            <label htmlFor="file-upload" className="cursor-pointer w-36 h-10 my-2 border text-center flex items-center justify-center text-slate-800 bg-slate-300 rounded-md" >
              Subir
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2" >
                <path strokeLinecap="round" strokeLinejoin="round"  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </label>
            <input id="file-upload" name="file-upload" type="file" onChange={showName} ref={fileInputRef} className="hidden"/>
            <p className='text-sm text-gray-600 ml-1 mb-2'>{avatar}</p>
            <button className='btn-submit'>Cambiar</button>
          </form>
        </div>
        
        <h1 className='text-xl sm:text-3xl mt-20 flex justify-center'>Cambiar datos del usuario</h1>
        <div className='flex justify-center'>
          <form className='m-8 w-4/5 md:w-1/3' onSubmit={handleSubmit}>

              {showMessage && <div className="fixed left-1/2 transform -translate-x-1/2 top-12 bg-red-500 text-white p-2 mb-2 rounded-md text-center">{error}</div>}

              <label>Nombre: </label>
              <input type='text' className="input-default my-2" placeholder='nombre' name="name" value={name} onChange={e => setName(e.target.value)}/>
              <label className='my-2'>Apellidos: </label>
              <input type='text' className="input-default my-2" placeholder='apellidos' name="surname" value={surname} onChange={e => setSurname(e.target.value)}/>
              <button className='btn-submit'>Guardar</button>
          </form>
        </div>
        
        {userData?.typeSign === "credential" && (
          <div>
          <h1 className='text-xl sm:text-3xl mt-20 flex justify-center'>Cambiar contraseña</h1>
          <div className='flex justify-center'>
            <form className='m-8 w-4/5 md:w-1/3' onSubmit={handleSubmitPassword}>

                {showMessage && <div className="fixed left-1/2 transform -translate-x-1/2 top-12 bg-red-500 text-white p-2 mb-2 rounded-md text-center">{error}</div>}

                <label>Contraseña antigua: </label>
                <div className="relative">
                  <input 
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Contraseña" 
                    name="oldPassword" 
                    className="input-default mb-4 px-4 py-2 w-full rounded-md" 
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-600"
                    onClick={() => setShowOldPassword(prev => !prev)}
                  >
                    <PasswordToggleIcon isPasswordVisible={showOldPassword} colorIcon='#374151'/>
                  </button>
                </div>

                <label className='my-2'>Nueva contraseña: </label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Contraseña" 
                    name="newPassword" 
                    className="input-default mb-4 px-4 py-2 w-full rounded-md" 
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-600"
                    onClick={() => setShowNewPassword(prev => !prev)}
                  >
                    <PasswordToggleIcon isPasswordVisible={showOldPassword} colorIcon='#374151'/>
                  </button>
                </div>
                
                <label className='my-2'>Confirmar contraseña: </label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Contraseña" 
                    name="confirmPassword" 
                    className="input-default mb-4 px-4 py-2 w-full rounded-md" 
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-600"
                    onClick={() => setShowNewPassword(prev => !prev)}
                  >
                    <PasswordToggleIcon isPasswordVisible={showOldPassword} colorIcon='#374151'/>
                  </button>
                </div>

                <button className='btn-submit'>Actualizar</button>
            </form>
          </div>
        </div>
        )}
        

        <h1 className='text-xl sm:text-3xl mt-10 flex justify-center'>Eliminar cuenta</h1>
        <div className='flex justify-center my-3'>
          <div className='w-2/5 sm:w-1/4'><button className='btn-danger' onClick={deleteUser}>Eliminar</button></div>
        </div>
    </Center>
  )
}

export default SettingsPage