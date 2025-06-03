import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function loginAdmin(req, res) {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({ message: "Administrador não encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = 'seu_token_aqui'; // Pode ser substituído por um JWT real
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
}

export async function criarAdmin(req, res) {
  const { email, name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const novoAdmin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

    res.status(201).json(novoAdmin);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    res.status(500).json({ erro: 'Erro ao criar admin' });
  }
}
