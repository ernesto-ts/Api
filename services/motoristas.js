
//import { PrismaClient } from '@prisma/client';
import prisma from "../node_modules/@prisma/client/default.js";


import * as bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

export const criarMotorista = async (req, res) => {
  try {
    const { email, name, cnh, categoria, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await prisma.driver.create({
      data: {
        email,
        name,
        cnh,
        categoria,
        password: hashedPassword,
      },
    });

    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar motorista', details: error.message });
  }
};

export const listarMotoristas = async (req, res) => {
  try {
    const motoristas = await prisma.driver.findMany();
    res.status(200).json(motoristas);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao listar motoristas', details: error.message });
  }
};

export const deletarMotorista = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Tentando excluir motorista com ID:', id);

    const motorista = await prisma.driver.findUnique({
      where: {
        id: id 
      }
    });

    if (!motorista) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    await prisma.driver.delete({
      where: {
        id: id 
      }
    });

    console.log('Motorista excluído com sucesso!!');
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir motorista:', error);
    res.status(500).json({ error: 'Erro ao excluir motorista', detalhes: error.message });
  }
};

export async function buscarMotoristaPorEmail(req, res) {
  const { email } = req.params;
  console.log("Buscando motorista com email:", email);

  try {
    const motorista = await prisma.driver.findUnique({
      where: { email },
    });

    if (!motorista) {
      console.log("Motorista não encontrado");
      return res.status(404).json({ message: "Motorista não encontrado" });
    }

    console.log("Motorista encontrado:", motorista);
    res.json(motorista);
  } catch (error) {
    console.error("Erro ao buscar motorista:", error);
    res.status(500).json({ message: "Erro ao buscar motorista", error: error.message });
  }
}

export async function loginMotorista(req, res) {
  const { email, password } = req.body;

  try {
    const motorista = await prisma.driver.findUnique({ where: { email } });

    if (!motorista) {
      return res.status(401).json({ message: 'Motorista não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, motorista.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Aqui você pode gerar um JWT real se quiser:
    // const token = jwt.sign({ id: motorista.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const token = 'token_motorista_exemplo';

    res.status(200).json({ token });
  } catch (error) {
    console.error("Erro ao fazer login do motorista:", error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
}