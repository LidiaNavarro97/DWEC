# DWEC · Refuerzo P1 · Imagen del entorno: Node 22 + Vite + ESLint + Git.
# Así no hay que hacer `npm install` en tu ordenador: todo vive dentro de la imagen.
FROM node:22-alpine
RUN apk add --no-cache git
WORKDIR /opt/herramientas
RUN npm install --no-audit --no-fund --loglevel=error \
      vite@8.3.3 eslint@9 @eslint/js@9 globals@16 \
 && npm pkg set type=module \
 && npm cache clean --force
ENV PATH=/opt/herramientas/node_modules/.bin:$PATH \
    NODE_PATH=/opt/herramientas/node_modules
COPY eslint.config.js /opt/herramientas/eslint.config.js
RUN git config --system --add safe.directory '*'
WORKDIR /app
