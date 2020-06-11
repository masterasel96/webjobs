import express, {Application} from 'express';
import UserRoute from './routes/user.route';
import ProfExpRoute from './routes/prof_exp.route';
import ProfCatRoute from './routes/prof_cat.route';
import NotificationRoute from './routes/notification.route';
import ContractRoute from './routes/contract.route';
import orm from './core/orm.core';
import morgan from 'morgan';
import cors from 'cors';
import helmet from "helmet";

export default class Server {
    public app: Application;
    public userRoute: UserRoute = new UserRoute();
    public profExpRoute: ProfExpRoute = new ProfExpRoute();
    public profCatRoute: ProfCatRoute = new ProfCatRoute();
    public notificationsRoute: NotificationRoute = new NotificationRoute();
    public contractRoute: ContractRoute = new ContractRoute();
    
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public config(): void {
        this.app.set('port', 3000);
        this.app.use(morgan('dev'));
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    public routes(): void {
        this.app.use('/users', this.userRoute.router);
        this.app.use('/profExp', this.profExpRoute.router);
        this.app.use('/profCat', this.profCatRoute.router);
        this.app.use('/notifications', this.notificationsRoute.router);
        this.app.use('/contracts', this.contractRoute.router);
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


