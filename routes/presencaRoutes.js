
import express from 'express';
import { registrarPresenca, encerrarViagem, getPresencasPorLinha } from "../services/presencaService.js";

const router = express.Router();

router.post("/registrar-presenca", registrarPresenca); // <-- ESSA LINHA!
router.post("/encerrar-viagem", encerrarViagem);
router.get("/presencas/:linhaId", getPresencasPorLinha);

export default router; 