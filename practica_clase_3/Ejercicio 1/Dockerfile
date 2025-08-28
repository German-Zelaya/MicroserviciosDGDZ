# Usar la imagen oficial de Node.js como base
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias
RUN npm install --only=production

# Copiar el resto del código de la aplicación
COPY . .

# Crear el directorio public si no existe
RUN mkdir -p public

# Exponer el puerto 3000
EXPOSE 8080

# Crear un usuario no-root para ejecutar la aplicación
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar la propiedad de los archivos al usuario nodejs
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Comando para ejecutar la aplicación
CMD ["npm", "start"]