import { Router } from 'express';

export default class GamesRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', (req, res) => {
            res.send('games');
        })
    }
}