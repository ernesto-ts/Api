import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()
const app = express()


app.use(express.json())
app.use(cors())

// CRIAR PONTO
app.post('/pontos', async (req, res) => {
  const { nome, latitude, longitude } = req.body;

  try {
    const novoPonto = await prisma.ponto.create({
      data: {
        nome,
        latitude: parseFloat(latitude), 
        longitude: parseFloat(longitude),
      },
    });
    res.status(201).json(novoPonto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar ponto' });
  }
});

app.get('/pontos', async (req, res) => {
  try {
    const pontos = await prisma.ponto.findMany();
    res.json(pontos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pontos' });
  }
});

//CRIAR PONTO



//CRIAR CARRO
app.post('/veiculos', async (req, res) => {
  try {
    const { tipo, marca, placa, lotacao } = req.body;

    const veiculo = await prisma.vehicle.create({
      data: {
        tipo,
        marca,
        placa,
        lotacao
      }
    });

    res.status(201).json(veiculo);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar veículo", details: error.message });
  }
});

//ver carros
app.get('/veiculos', async (req, res) => {
  try {
    const veiculos = await prisma.vehicle.findMany();
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar veículos" });
  }
});
//ver carros

//delete carros
app.delete("/veiculos/:id", async (req, res) => {
  const { id } = req.params;
  console.log('ID do veículo:', id); // log útil pra debug

  try {
    const veiculoExistente = await prisma.veiculo.findUnique({
      where: { id },
      select: {
        placa: true,
        marca: true,
        lotacao: true,
      },
    });

    if (!veiculoExistente) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }

    await prisma.veiculo.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Veículo deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar veículo:", error);
    return res.status(500).json({ error: "Erro ao deletar veículo", details: error.message });
  }
});





//CRIAR CARRO
//ADM GERADOR
app.post('/admins', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // const existingAdmin = await prisma.admin.findUnique({ where: { email } });

    // if (existingAdmin) {
    //   return res.status(400).json({ error: 'Administrador já cadastrado' });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar administrador', details: error.message });
  }
});

//ADM GERADOR

//driver gerador
app.post('/driver', async (req, res) => {
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

    // Responde com o motorista criado
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar motorista', details: error.message });
  }
});


app.get('/motoristas', async (req, res) => {
  try {
    // Consulta todos os motoristas
    const motoristas = await prisma.driver.findMany();

    // Retorna os motoristas encontrados
    res.status(200).json(motoristas);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao listar motoristas', details: error.message });
  }
});

//driver gerador

//NÃO ALTERAR
app.post('/usuarios', async (req, res) => {
  try {
    // Recebendo os dados da requisição
    const { name, email, password } = req.body;
    //FALTA ,age
    // Verificando se a idade é um número válido
    // if (isNaN(age)) {
    //   return res.status(400).json({ error: 'A idade precisa ser um número válido' });
    // }

    // Criptografando a senha
    const hashedPassword = await bcrypt.hash(password, 10);  // Criptografando a senha com 10 "salt rounds"

    // Criando o usuário no banco de dados com a senha criptografada
    const user = await prisma.user.create({
      data: {
        name: name,
        //age: parseInt(age, 10),  // Certificando-se de que age é um número
        email: email,
        password: hashedPassword  // Salvando a senha criptografada
      }
    });

    // Retornando o usuário criado
    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    res.status(400).json({ error: 'Erro ao criar usuário', details: error.message });
  }
});
//NÃO ALTERAR
//NÃO ALTERAR
app.get('/usuarios', async (req, res) => {
  try {
    let users; 
    if (req.query.name || req.query.email) {
      users = await prisma.user.findMany({
        where: {
          name: req.query.name ? { contains: req.query.name } : undefined, // Filtro de nome
          email: req.query.email ? { contains: req.query.email } : undefined, // Filtro de email
        },
        select: { 
          id: true,
          name: true,
          email: true,
         
        }
      });
    } else {
      users = await prisma.user.findMany({
        select: { 
          id: true,
          name: true,
          email: true,          
        }
      });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
  }
});
//NÃO ALTERAR


app.put('/usuarios/:id', async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.params.id
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      // age: req.body.age
    }
  })
  console.log(req)

  res.status(201).json(req.body)
});

app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params; // Verifique se 'id' está correto
  console.log('ID do usuário:', id); // Verifique o valor de 'id' aqui
  try {
    const usuarioExistente = await prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        password: true,
      },
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
});

// app.delete("/usuarios/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const usuarioExistente = await prisma.user.findUnique({
//       where: { id },
//       select: {
//         name: true,
//         email: true,
//         password: true
//       }
//     });
//     if (!usuarioExistente) {
//       return res.status(404).json({ error: "Usuário não encontrado" });
//     }

//     await prisma.user.delete({
//       where: { id }
//     });

//     return res.status(200).json({ message: "Usuário deletado com sucesso" });
//   } catch (error) {
//     console.error("Erro ao deletar usuário:", error);
//     return res.status(500).json({ error: "Erro ao deletar usuário", details: error.message });
//   }
// });

//#############LOGIN################
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Geração de um token de login (exemplo)
    const token = 'seu_token_aqui'; // Geração do token (recomendo o uso de JWT ou outra solução)

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});

//#############################

//ADM LOGIN
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try{ 
    const admin = await prisma.admin.findUnique({
      where: {email},
    });
    if (!admin) {
      return res.status(401).json({ message: "Administrador não encontrado" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }
    const token = 'seu_token_aqui'; // Geração do token (recomendo o uso de JWT ou outra solução)

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
  });

//ADM LOGIN
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

