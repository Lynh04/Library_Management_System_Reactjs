import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CRUD API",
            description: "API documentation for CRUD application",
        },
        host: "localhost:3001",
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "User name",
                        },
                        email: {
                            type: "string",
                            description: "User email",
                        },
                        password: {
                            type: "string",
                            description: "User password",
                        },
                        phone: {
                            type: "string",
                            description: "User phone",
                        },
                        dayOfBirth: {
                            type: "string",
                            description: "User day of birth",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};