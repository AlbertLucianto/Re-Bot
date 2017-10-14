import express, { Router } from 'express';
import SecurityDb from '../db/security.db';

export const createRouter = db => {
  const router = Router();
  const securityDb = new SecurityDb(db);

  router.get('/', (req, res) => {
    securityDb.getSecurity()
      .then(
        sec => {
          res.render('report.html', { description: sec.description });
        }
      ).catch(err => {
        console.log(err);
        res.end();
      });
  });

  return router;
};

export default createRouter;