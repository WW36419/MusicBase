import express from 'express'
import { config } from './config'
import Controller from "./interfaces/controller.interface"
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import Database from './db/database'

import swaggerUi from 'swagger-ui-express';
import openApiSpec from '../openapi-resolved.json';


class App {
    public app: express.Application;
    
    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeCORS();
        this.initializeDocs();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.connectToDatabase();
    }


    private initializeCORS(): void {
        this.app.use(cors({
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
          }));
    }

    private initializeDocs(): void {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
    }    

    private initializeMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));
    }     
 
    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private async connectToDatabase(): Promise<void> {
        try {
            const db = new Database(config.db_info);
            await db.getClient()
            console.log('Connection with database established')
        } catch (error) {
            console.error('Error connecting to PostgreSQL database:', error);
        }
    }
    
    public listen(): void {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        });
    }
} export default App;