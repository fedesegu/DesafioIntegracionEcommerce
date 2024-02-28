import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "../utils/utils.js";
import { join } from "path";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Market API",
            version: "1.0.0",
            description: "API documentation",
        },
    },
    apis: [join(__dirname, "docs", "*.yaml")],
};

export const swaggerSetup = swaggerJSDoc(swaggerOptions);