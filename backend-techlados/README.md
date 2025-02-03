SOBRE LA APLICACIÓN WEB
-------------------------
Esta aplicación esta desarrollada con NextJS y TailwindCSS. Este proyecto esta desarrollado gracias a Coding With Dawid, como metodo de aprendizadeje del framework de NextJS.Este proyecto es el backend de un ecommerce.


PASOS PARA EL FUNCIONAMIENTO
-------------------------------
git clone 
cd next-ecommerce
npm install
touch .env
npm run dev


CONFIGURACIÓN DEL FICHERO .ENV
--------------------------------
EL fichero .env debera contener las siguientes variables:
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
MONGODB_URI="Dirección de MongoDB"
MAIL_ADMIN="Correo del administrador"


FUNCIONALIDADES DE LA APLIACIÓN WEB
------------------------------------
En esta aplicacion deberemos iniciar sesion con la cuenta de google y para poder acceder a ella tendremos que añadirla la varible MAIL_ADMIN del .env. La informacion de la sesion y del usuario se almacenara en en MongoDB.

Podremos crear diferentes categorias a las cuales podremos establecerlas como categoria padre o hija de alguna categoria creada anteriormente. Tambien podremos agregarle diferentes propiedades.

Crear productos a los cuales le podremos añadir las diferentes categorias y propiedads creadas, tambien se le añadiran diferentes images.

Por último, en la ordenes veremos las ordenes hechas en el frontend y ver si estan pagadas o no.


