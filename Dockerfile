FROM node:14 

WORKDIR /app 

COPY package.json package.json 

RUN yarn install 

COPY . . 

EXPOSE 3031  

CMD [ "yarn", "run", "dev" ] // start server inside container