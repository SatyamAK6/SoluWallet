import { Router } from 'express';

import  * as mainController from '../controllers/main';
import isAuth from '../middleware/is-auth';

const mainRoutes = Router();

mainRoutes.get('/api/gettxs', isAuth, mainController.getTxs);

mainRoutes.post('/api/sendToken', isAuth, mainController.transferToken);

mainRoutes.get('/api/getbalance', isAuth, mainController.getBalances);

mainRoutes.get('/api/sendeth/:address', isAuth, mainController.transfetEth);

export default mainRoutes;