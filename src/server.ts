import * as express from 'express';
import * as bodyParser from 'body-parser';
import { IRoute } from './routes';

export class Server {

  public app: express.Application;

  constructor() {
    this.app = express();
  }

  public routes(path: string, route: IRoute) {
    let router: express.Router = express.Router();
    route.register(path, router);

    this.app.use(router);
  }
}