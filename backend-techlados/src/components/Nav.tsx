import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

/* Definimos la funcion que recibira la cual solo retornara un valor boleano */
interface NavProps {
  updateShowHeader: (newState: boolean) => void;
}

export const Nav: React.FC<NavProps> = ({ updateShowHeader }) => {
  const inactiveLink = "flex gap-1 p-1";
  const activeLink = inactiveLink + " bg-gray-300 text-black rounded-md";
  const inactiveIcon = " w-6 h-6 size-6";
  const activeIcon = inactiveIcon + " text-black";
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    updateShowHeader(false);
  }

  async function logout() {
    await router.push("/");
    await signOut();
  }

  return (
    <nav className="flex flex-col gap-2">
      <Link href={"/"} className={pathname == "/" ? activeLink : inactiveLink} onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={pathname == "/" ? activeIcon : inactiveIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        Dashboard
      </Link>

      <Link
        href={"/products"}
        className={pathname.includes("/products") ? activeLink : inactiveLink}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={pathname == "/products" ? activeIcon : inactiveIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
        Productos
      </Link>

      <Link
        href={"/orders"}
        className={pathname.includes("/orders") ? activeLink : inactiveLink}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={pathname == "/orders" ? activeIcon : inactiveIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>
        Ordenes
      </Link>

      <Link
        href={"/categories"}
        className={pathname.includes("/categories") ? activeLink : inactiveLink}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={pathname == "/categories" ? activeIcon : inactiveIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        Categorias
      </Link>

      <Link
        href={"/brands"}
        className={pathname.includes("/brands") ? activeLink : inactiveLink}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 512 512"
          strokeWidth={1.5}
          stroke="currentColor"
          className={pathname == "/brands" ? activeIcon : inactiveIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM199.4 312.6c-31.2-31.2-31.2-81.9 0-113.1s81.9-31.2 113.1 0c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9c-50-50-131-50-181 0s-50 131 0 181s131 50 181 0c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0c-31.2 31.2-81.9 31.2-113.1 0z"
          />
        </svg>
        Marcas
      </Link>

      <button onClick={logout} className={inactiveLink}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={inactiveIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
          />
        </svg>
        Cerrar Sesión
      </button>
    </nav>
  );
};
