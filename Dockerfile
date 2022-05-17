FROM node
WORKDIR /Code
COPY . .
EXPOSE 3000
CMD ["npm", "start"]