import { Center } from "./Center";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from '@/context/UserContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

export const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { userData } = useUser();

  async function logout() {
    await router.push('/');
    await signOut();
  }

  return (
    <header className="bg-[#222] text-white">
      <Center>
        <div className="flex justify-between items-center py-5">
          <Link href="/" className="text-xl font-bold ml-4 md:ml-0">Tech-Lados</Link>

          {/* Botón de menú hamburguesa en móviles */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6 mr-4" />
            ) : (
              <Bars3Icon className="w-6 h-6 mr-4" />
            )}
          </button>

          {/* Menú en pantallas grandes */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="menuStyle">Home</Link>
            <Link href="/products" className="menuStyle">Productos</Link>
            <Link href="/cart" className="menuStyle">Carrito</Link>

            {/* Avatar con submenú */}
            <div className="relative">
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} type="button">
                <img
                  src={userData?.avatar === "default.png"
                    ? "/default.png"
                    : `/avatars/${userData?.avatar}`}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-700 rounded-lg shadow-lg z-20">
                  <ul className="py-2 text-sm">
                    <li className="px-4 py-2 hover:bg-gray-600">
                      <Link href="/settings" onClick={() => setIsUserMenuOpen(false)}>Ajustes</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-600">
                      <button onClick={logout}>Cerrar sesión</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 space-y-2 ">
            <Link href="/" className="menuStyleResponsive">Home</Link>
            <Link href="/products" className="menuStyleResponsive">Productos</Link>
            <Link href="/cart" className="menuStyleResponsive">Carrito</Link>

            {/* Cuenta con submenu */}
            <div className="px-4">
              <details className="group">
                <summary className="cursor-pointer py-2 text-[#aaa]">Cuenta</summary>
                <ul className="pl-4 text-sm text-white">
                  <li className="px-2 py-1 rounded hover:bg-[#374151]">
                    <Link href="/settings">Ajustes</Link>
                  </li>
                  <li className="px-2 pt-1 pb-4 rounded">
                    <button onClick={logout}>Cerrar sesión</button>
                  </li>
                </ul>
              </details>
            </div>
          </div>
        )}
      </Center>
    </header>
  );
};
