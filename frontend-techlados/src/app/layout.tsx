"use client"

import "./globals.css";
import { usePathname, useRouter } from "next/navigation";

import { UserProvider } from "@/context/UserContext";
import { ProductProvider } from "@/context/ProductContext";
import Providers from "./Providers";
import AuthGuard from "@/components/AuthGuard";
import { Header } from "@/components/Header";

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
            <ProductProvider>
              {/* Mostrar Header solo en rutas protegidas */}
              {!isPublicRoute && <Header />}

              {/* Envolver rutas protegidas en AuthGuard */}
              {isPublicRoute ? (
                <main>{children}</main>
              ) : (
                <AuthGuard>
                    <main>{children}</main>
                </AuthGuard>
                )}
              </ProductProvider>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );


}
