import { YellowTaxiController } from '../controllers/yellowTaxi.controller';
import { Router } from 'express';

export class YellowTaxiRouter {
  private router: Router;
  private yellowTaxiController: YellowTaxiController;

  constructor() {
    this.yellowTaxiController = new YellowTaxiController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/hello', this.yellowTaxiController.hello);
    this.router.get('/', this.yellowTaxiController.getAllYellowTaxiTrip);
    this.router.get('/sorted', this.yellowTaxiController.getSortedYellowTaxiTrip);
  }

  getRouter(): Router {
    return this.router;
  }
}
