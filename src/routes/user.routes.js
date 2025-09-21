import { Router } from 'express';
import { login, signUp } from '../controllers/user.controller.js';
import { verifyJWT } from '../utils/AuthUtils.js';

const router = Router();

router.route('/signUp').post(signUp);
router.route('/login').post(login);

router.route('/jwt').get(verifyJWT);


export default router;
