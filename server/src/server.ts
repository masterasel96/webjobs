import express, {Application} from 'express';
import UserRoute from './routes/user.route';
import ProfExpRoute from './routes/profExp.route';
import ProfCatRoute from './routes/profCat.route';
import orm from './core/orm.core';
import morgan from 'morgan';
import cors from 'cors';

export default class Server {
    public app: Application;
    public userRoute: UserRoute = new UserRoute();
    public profExpRoute: ProfExpRoute = new ProfExpRoute();
    public profCatRoute: ProfCatRoute = new ProfCatRoute();
    
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
        this.app.use('/users', this.userRoute.router);
        this.app.use('/profExp', this.profExpRoute.router);
        this.app.use('/profCat', this.profCatRoute.router);
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


