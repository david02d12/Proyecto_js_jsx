const swaggerAutogen = require ('swagger-autogen');

const outputFile = './swagger.json';
const endPointsFiles = ['./server.js'];

const doc = {
    info: {
        title: 'Api de tablas del proyecto',
        description: 'Estas Api nos permiten la funcionalidad de nuestro Proyecto celuaccel'
        } ,
        host: 'localhost:3000',
        schemes: ['Http']

}

swaggerAutogen(outputFile,endPointsFiles, doc);
