import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
    _id: string;
    name: string;
    surname: string;
    avatar: string;
    email: string;
    typeSign: string;
}

// Define el tipo del contexto
interface UserContextType {
    userData: User | null;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
    userChange: boolean;
    setUserChange: React.Dispatch<React.SetStateAction<boolean>>;
  }

// Creamos el contexto con un valor por defecto
const UserContext = createContext<UserContextType | undefined>(undefined);

/* 
  Creamos el provider que englobara todos los componentes 
  En el definiremos las variables que podremos utilizar, como los datos del usuario
*/
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [userChange, setUserChange] = useState(true);
  
    return (
      <UserContext.Provider value={{ userData, setUserData, userChange, setUserChange }}>
        {children}
      </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};