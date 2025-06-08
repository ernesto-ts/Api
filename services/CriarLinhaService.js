//import { PrismaClient } from '@prisma/client';
import prisma from "../node_modules/@prisma/client/default.js";

import { ObjectId } from 'mongodb';

// const prisma = new PrismaClient();

export async function criarLinha(req, res) {
  const { nome, rotaId, veiculoId, motoristaId } = req.body;

  if (!nome || !rotaId || !motoristaId) {
    return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos' });
  }

  try {
    const linha = await prisma.linha.create({
      data: {
        nome,
        rotaId,
        motoristaId,
        veiculoId: veiculoId || undefined,
      },
    });

    res.status(201).json({ mensagem: 'Linha criada com sucesso', linha });
  } catch (error) {
    console.error('Erro ao criar linha:', error);
    res.status(500).json({ erro: 'Erro interno ao criar linha' });
  }
}


export async function getLinhaPorId(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  try {
    const linha = await prisma.linha.findUnique({
      where: { id },
      include: {
        rota: {
          include: {
            pontos: true,
          },
        },
        motorista: true,
        veiculo: true,
      },
    });

    if (!linha) {
      return res.status(404).json({ erro: 'Linha não encontrada' });
    }

    res.json(linha);
  } catch (err) {
    console.error("Erro ao buscar linha:", err);
    res.status(500).json({ erro: 'Erro ao buscar linha' });
  }
}

export async function listarLinhas(req, res) {
  try {
    const linhas = await prisma.linha.findMany({
      include: {
        rota: true,
        veiculo: true,
        motorista: true,
        usuarios: {
          include: {
            usuario: true
          }
        }
      }
    });

    res.json(linhas);
  } catch (error) {
    console.error('Erro ao listar linhas:', error);
    res.status(500).json({ erro: 'Erro ao listar linhas' });
  }
}


export async function listarUsuariosPorLinha(linhaId) {
  try {
    const inscricoes = await prisma.linha.findUnique({
      where: { id: linhaId },
      include: {
        usuarios: {
          include: {
            usuario: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Retorna só a lista dos usuários (extrai do array de inscrições)
    return inscricoes && inscricoes.usuarios
      ? inscricoes.usuarios.map(inscricao => inscricao.usuario)
      : [];
  } catch (error) {
    console.error("Erro no service listarUsuariosPorLinha:", error);
    throw error;
  }
}

export async function buscarLinhaPorMotorista(req, res) {
  const { motoristaId } = req.params;

  try {
    const linha = await prisma.linha.findFirst({
      where: { motoristaId },
      include: { rota: { include: { pontos: true } } }
    });

    if (!linha) return res.status(404).json({ message: "Linha não encontrada" });

    res.json(linha);
  } catch (error) {
    console.error("Erro ao buscar linha do motorista:", error);
    res.status(500).json({ error: "Erro ao buscar linha do motorista" });
  }
}



export  async function buscarLinhasDoUsuario(req, res) {
  const { usuarioId } = req.params;

  try {
    const inscricoes = await prisma.usuarioNaLinha.findMany({
      where: { usuarioId },
      include: {
        linha: {
          include: {
            rota: {
              include: { pontos: true }
            },
            motorista: true,
             veiculo: true,
          }
        }
      }
    });

    if (!inscricoes.length) {
      return res.status(404).json({ message: "Nenhuma linha encontrada para o usuário" });
    }

    const linhas = inscricoes.map(i => i.linha);
    res.json(linhas);
  } catch (error) {
    console.error("Erro ao buscar linhas do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar linhas do usuário" });
  }
}

export async function listarUsuariosDaLinha(req, res) {
  const { id: linhaId } = req.params;

  try {
    const linha = await prisma.linha.findUnique({
      where: { id: linhaId },
      include: {
        usuarios: {
          include: {
            usuario: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!linha) {
      return res.status(404).json({ message: 'Linha não encontrada' });
    }

    const usuarios = linha.usuarios.map(inscricao => inscricao.usuario);
    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários da linha:", error);
    res.status(500).json({ erro: "Erro ao listar usuários da linha" });
  }
}
