# Usa Node.js como base
FROM node:18-alpine

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto del servicio SOAP
EXPOSE 4000

# Inicia la aplicación SOAP
CMD ["npm", "run", "start"]