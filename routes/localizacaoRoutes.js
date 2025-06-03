import express from "express";
import { salvarLocalizacao, buscarLocalizacao } from "../services/localizacao.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();

router.post("/", async (req, res) => {
  const { usuarioId, lat, lng, timestamp, nome } = req.body;

  if (!usuarioId || !lat || !lng || !timestamp || !nome) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try { 
    const localizacao = await salvarLocalizacao({ usuarioId, lat, lng, timestamp, nome });
    res.json({ ok: true, localizacao });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
 
// GET /localizacao/:usuarioId
router.get("/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const localizacao = await buscarLocalizacao(usuarioId);
    if (!localizacao) {
      return res.status(404).json({ error: "Localização não encontrada" });
    }
    res.json(localizacao);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET /localizacao
router.get("/", async (req, res) => {
  try {
    const localizacoes = await prisma.localizacao.findMany({
      orderBy: {
        timestamp: "desc",
      },
    });
    res.json(localizacoes);
  } catch (error) {
    console.error("Erro ao buscar localizações:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});


export default router;
