import { ReactNode, useState } from 'react'
import { Header } from './Header';
import Logo from './Logo';

interface PrivateLayoutProps {
    children: ReactNode;
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({children}) => {

    const [ showHeader, setShowHeader ] = useState<boolean>(false);

    /* Creamos una prop que le pasaremos al Header para despues pasarlo al Nav */
    const updateShowHeader = (newState: boolean) => {
      setShowHeader(newState);
    };
    
    return (
        <div className="bg-bgGray min-h-screen ">
          <div className=" md:hidden flex items-center p-4">
            <button onClick={() => setShowHeader(!showHeader)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            </button>
            <div className="flex grow justify-center mr-6">
              <Logo />
          </div>
          </div>
          <div className="flex">
            <Header show={showHeader} updateShowHeader={updateShowHeader}/>
            <div className="flex-grow p-6">
              {children}
            </div>
          </div>
      </div>
    )
}