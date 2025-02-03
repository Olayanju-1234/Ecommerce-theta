import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Name',
      version: '1.0.0',
      description: 'API Documentation using Swagger',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
      {
        url: 'https://ecommerce-theta.onrender.com',
        description: 'Deployed API on Render',
      },
    ],
    components: {
      securitySchemes: {
        xAccessToken: {
          type: 'apiKey',
          in: 'header',
          name: 'x-access-token', 
          description: 'API key for authentication (use your JWT token)',
        },
      },
    },
    security: [{ xAccessToken: [] }], 
  },
  apis: ['./src/docs/*.ts'], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log('📄 Swagger Docs available at:');
  console.log('👉 Local: http://localhost:5000/api-docs');
  console.log('👉 Deployed: https://ecommerce-theta.onrender.com/api-docs');
};
