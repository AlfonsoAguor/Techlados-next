SOBRE LA APLICACIÓN WEB
------------------------
Aplicación para la autenticación para proyectos desarrollados con nextjs. utilizando Typescript.
Para la autenticación utilizo la libreria next-auth con JWT, junto a rutas protegidas tanto para el frontend como para el backend.

En ella podras registrarte mediante credenciales y podras iniciar sesión con el usuario creado o con google.
Todo los datos del usuario registrado con credenciales o con google, se alamcenaran en la base de datos MongoDB.

El usuario autenticado podra cambiar sus datos, el avatar o establecer una contraseña nueva.

PASOS PARA EL FUNCIONAMIENTO
------------------------------
git clone https://github.com/AlfonsoAguor/next-auth
cd next-auth
npm install
mv .env.example .env
npm run dev
