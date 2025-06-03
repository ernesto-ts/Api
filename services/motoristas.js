
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

    console.log('Motorista excluído com sucesso!');
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir motorista:', error);
    res.status(500).json({ error: 'Erro ao excluir motorista', detalhes: error.message });
  }
};
