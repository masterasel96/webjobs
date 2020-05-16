import { Router } from 'express';

export default class IndexRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', (req, res) => {
            res.send('hello');
        })
    }
}
