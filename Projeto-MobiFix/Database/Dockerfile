FROM node:20-alpine

WORKDIR /usr/src/app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala as dependências limpas
RUN npm ci --only=production

# Copia todo o código (o .dockerignore vai ignorar os node_modules locais)
COPY . .


EXPOSE 5000

# Inicia a API
CMD ["npm", "start"]