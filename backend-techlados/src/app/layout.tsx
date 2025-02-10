"use client"

import "./globals.css";
import { usePathname, useRouter } from "next/navigation";

import { UserProvider } from "@/context/UserContext";
import Providers from "../providers/Providers";
import AuthGuard from "@/providers/AuthGuard";
import { PrivateLayout } from "@/components/PrivateLayout";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {

  /* Comprobacion de rutas publicas */
  const pathname = usePathname();
  const publicRoutes = ["/login", "/register" ];
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="es">
      <head>
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <UserProvider>
            {/* Envolver rutas protegidas en AuthGuard */}
            {isPublicRoute ? (
              <main>{children}</main>
            ) : (
              <AuthGuard>
                <PrivateLayout>{children}</PrivateLayout>
              </AuthGuard>
              )}
          </UserProvider>
        </Providers>
      </body>
    </html>
  );


}
