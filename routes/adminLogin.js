
import express from 'express';
import { loginAdmin, 
  criarAdmin } 
  from '../services/adminloginService.js';

const router = express.Router();

router.post('/admin/login', loginAdmin);
router.post('/admin', criarAdmin);

export default router;
