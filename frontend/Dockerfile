FROM node:lts

ENV PORT=3000

WORKDIR /frontend

COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json

RUN npm ci

COPY . /frontend/
CMD ["npm", "start"]