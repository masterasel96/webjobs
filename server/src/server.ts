import express, {Application} from 'express';
import IndexRoutes from './routes/indexRoutes';
import GamesRoutes from './routes/gamesRoutes';
import orm from './core/orm.core';
import morgan from 'morgan';
import cors from 'cors';

export default class Server {
    public app: Application;
    public indexRoutes: IndexRoutes = new IndexRoutes();
    public gamesRoutes: GamesRoutes = new GamesRoutes();
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    public routes(): void {
        this.app.use('/', this.indexRoutes.router);
        this.app.use('/api/games', this.gamesRoutes.router);
    }

    public async start(): Promise<boolean> {
        try {
            await orm.connect();
            this.app.listen(this.app.get('port'), () => {
                console.log(`Server on port ${this.app.get('port')}`);
            });
        } catch (error) {
            console.log(`Server isn´t working: ${error.message}`);
            return false;
        }
        return true;
    }
}


