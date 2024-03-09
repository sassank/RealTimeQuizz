# Image de node.js
FROM node:14

# Répertoire de travail à l'intérieur du conteneur
WORKDIR /

# Copie du package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

COPY . .

# Le port sur lequel le serveur écoute
EXPOSE 4444

# Commande par défaut pour exécuter l'application
CMD ["node", "server.js"]
