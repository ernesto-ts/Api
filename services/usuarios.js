/*Aqui se cria usuario lista edita somente o usuario*/
// import prisma from "../node_modules/@prisma/client/default.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
//import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export const criarUsuario = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    res.status(400).json({ error: 'Erro ao criar usuário', details: error.message });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    let users;
    if (req.query.name || req.query.email) {
      users = await prisma.user.findMany({
        where: {
          name: req.query.name ? { contains: req.query.name } : undefined,
          email: req.query.email ? { contains: req.query.email } : undefined
        },
        select: { id: true, name: true, email: true }
      });
    } else {
      users = await prisma.user.findMany({
        select: { id: true, name: true, email: true }
      });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
  }
};

export const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const usuarioAtualizado = await prisma.user.update({
      where: { id },
      data: { name, email }
    });

    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error.message);
    res.status(500).json({ error: "Erro ao atualizar usuário", details: error.message });
  }
};

export const deletarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioExistente = await prisma.user.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({ error: "Erro ao deletar usuário", details: error.message });
  }
};
