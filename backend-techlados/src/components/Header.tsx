import { Nav } from "./Nav";
import Logo from "./Logo";
import useWindowSize from "@/hooks/useScreenSize";

/* Definimos las props que recibira */
interface HeaderProps {
  show: boolean;
  updateShowHeader: (newState: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ show, updateShowHeader }) => {
  const { width } = useWindowSize();

  return (
    <aside
      className={
        (show ? "left-0" : " -left-full") +
        " top-10 text-gray-500 p-4 fixed w-full bg-bgGray h-full md:static md:w-auto transition-all"
      }
    >
      <div className="mb-4 mr-4">{width && width >= 768 && <Logo />}</div>
      <Nav updateShowHeader={updateShowHeader} />
    </aside>
  );
};
