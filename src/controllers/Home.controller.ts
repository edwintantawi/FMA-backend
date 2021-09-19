import { Request, Response } from 'express';

export class HomeController {
  static renderHomePage(_: Request, res: Response): void {
    return res.status(200).render('index');
  }
}
