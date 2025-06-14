import express from 'express';
import { PrismaClient } from '@prisma/client';
import { criarLinha, getLinhaPorId, listarLinhas, listarUsuariosPorLinha } from '../services/CriarLinhaService.js';

const prisma = new PrismaClient();
const router = express.Router();

// Rota para criar uma nova linha (admin)
router.post('/criar-linha', criarLinha);
router.get('/:id', getLinhaPorId); 
router.get('/', listarLinhas);

// GET /api/linhas/motorista/email/:email
router.get('/motorista/:motoristaId', async (req, res) => {
  const { motoristaId } = req.params;

  try {
    const linha = await prisma.linha.findFirst({
      where: { motoristaId },
      include: { rota: { include: { pontos: true } } } // <- isso é necessário para montar o Google Maps
    });

    if (!linha) return res.status(404).json({ message: "Linha não encontrada" });

    res.json(linha);
  } catch (error) {
    console.error("Erro ao buscar linha do motorista:", error);
    res.status(500).json({ error: "Erro ao buscar linha do motorista" });
  }
});

router.get('/:id/usuarios', async (req, res) => {
  const { id } = req.params;

  try {
    const usuarios = await listarUsuariosPorLinha(id);
    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários da linha:", error);
    res.status(500).json({ erro: "Erro ao listar usuários da linha" });
  }
});

// // GET /api/linhas/usuario/:usuarioId
// router.get('/usuario/:usuarioId', async (req, res) => {
//   const { usuarioId } = req.params;

//   try {
//     const inscricoes = await prisma.usuarioNaLinha.findMany({
//       where: { usuarioId },
//       include: {
//         linha: {
//           include: {
//             rota: {
//               include: { pontos: true }
//             },
//             motorista: true,
//             veiculo: true  
//           }
//         }
//       }
//     });

//     if (!inscricoes.length) {
//       return res.status(404).json({ message: "Nenhuma linha encontrada para o usuário" });
//     }

//     const linhas = inscricoes.map(i => i.linha);
//     res.json(linhas);
//   } catch (error) {
//     console.error("Erro ao buscar linhas do usuário:", error);  // <- ISSO aqui vai mostrar a causa no terminal
//     res.status(500).json({ error: "Erro ao buscar linhas do usuário" });
//   }
// });
router.get('/usuario/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  console.log("🔍 Recebido usuarioId:", usuarioId);

  try {
    const inscricoes = await prisma.usuarioNaLinha.findMany({
      where: { usuarioId },
      include: {
        linha: {
          include: {
            rota: { include: { pontos: true } },
            motorista: true,
            veiculo: true
          }
        }
      }
    });

    console.log("✅ Inscrições encontradas:", inscricoes.length);

    if (!inscricoes.length) {
      return res.status(404).json({ message: "Nenhuma linha encontrada para o usuário" });
    }

    const linhas = inscricoes.map(i => i.linha);
    res.json(linhas);
  } catch (error) {
    console.error("❌ Erro ao buscar linhas do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar linhas do usuário" });
  }
});

export default router;