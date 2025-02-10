import { DefaultSession } from "next-auth";

/*
    Modificamos la configuracion predeterminada de next-auth
    para añadirle _id al user y no genearar erroes que nos indica
    que no existe
*/

declare module "next-auth" {
  interface Session {
    user: {
      _id: stringg;
    } & DefaultSession["user"];
  }
}
