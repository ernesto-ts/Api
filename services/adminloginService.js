// //import { PrismaClient } from '@prisma/client';
// import prisma from "../node_modules/@prisma/client/default.js";

// import bcrypt from 'bcrypt';

// // const prisma = new PrismaClient();

// export async function loginAdmin(req, res) {
//   const { email, password } = req.body;
//   try {
//     const admin = await prisma.admin.findUnique({
//       where: { email },
//     });

//     if (!admin) {
//       return res.status(401).json({ message: "Administrador não encontrado" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Senha incorreta' });
//     }

//     const token = 'seu_token_aqui'; // Pode ser substituído por um JWT real
//     res.status(200).json({ token });
//   } catch (error) {
//     console.error('Erro ao fazer login:', error);
//     res.status(500).json({ message: 'Erro no servidor', error: error.message });
//   }
// }

// export async function criarAdmin(req, res) {
//   const { email, name, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const novoAdmin = await prisma.admin.create({
//       data: {
//         email,
//         name,
//         password: hashedPassword
//       }
//     });

//     res.status(201).json(novoAdmin);
//   } catch (error) {
//     console.error('Erro ao criar admin:', error);
//     res.status(500).json({ erro: 'Erro ao criar admin' });
//   }
// }
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const criarAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const novoAdmin = await prisma.admin.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json(novoAdmin);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    res.status(500).json({ error: 'Erro ao criar admin' });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Admin não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(password, admin.password);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    res.status(200).json({ message: 'Login bem-sucedido', adminId: admin.id });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};
