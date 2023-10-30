import { Router } from 'express';
import AuthController from './controllers/AuthController';

// import UserController from './controllers/user.js';
// import { isAdmin, IsEditAccess } from './lib/middleware';


const router = Router();

// Authentication routes
router.post('/auth/register', AuthController.register);
router.get('/auth/verify', AuthController.verification);


router.post('/auth/login', AuthController.login);
router.get('/auth/validate', AuthController.validate);
router.get('/auth/logout', AuthController.logout);

// // Account routes
// router.get('/users', UserController.list);
// router.get('/users/modules', UserController.listModule);
// router.post('/users', isAdmin, UserController.create);
// router.get('/users/:id', UserController.getById);
// router.delete('/users/:id', isAdmin, UserController.deleteById);
// router.put('/users', isAdmin, UserController.updateById);
// router.get('/users/details/:id', UserController.getDetails);





export default router;
