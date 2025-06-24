"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

interface User {
  _id: string;
  name: string;
  surname: string;
  avatar: string;
  email: string;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userSession = session?.user as User;

  const { userData, setUserData, userChange } = useUser();

  useEffect(() => {
    if (userSession && userChange) {
      const fetchUserData = async () => {
        const res = await axios.get(`/api/user/${userSession?._id}`);
        setUserData(res.data);
      };
      fetchUserData();
    }
  }, [userSession, setUserData, userChange]);

  // Comprobaciones para el usuario no registrado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
