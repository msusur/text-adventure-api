import * as express from 'express';

export interface IRoute {
  register(path: string, router: express.Router);
}