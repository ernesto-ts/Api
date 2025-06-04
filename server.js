// import express from 'express';
// import cors from 'cors';

// import veiculosRoutes from './routes/veiculos.js';
// import usuariosRoutes from './routes/usuarios.js'; 
// import motoristasRoutes from './routes/motoristas.js';
// import loginRoute from './routes/login.js';
// import adminLogin from './routes/adminLogin.js';
// import rotas from './routes/rotas.js'
// import localizacaoRoutes from './routes/localizacaoRoutes.js';
// import linhasRoutes from './routes/CriarLinhaRoutes.js';
// import inscricaoRoutes from './routes/InscricaoRoutes.js';
// import presencaRoutes from './routes/presencaRoutes.js';

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api/veiculos', veiculosRoutes);  
// app.use('/api/usuarios', usuariosRoutes);  
// app.use('/api', motoristasRoutes);
// app.use('/api', loginRoute); 
// app.use('/api', adminLogin);
// app.use('/api', rotas);
// app.use("/localizacao", localizacaoRoutes);
// app.use('/api/linhas', linhasRoutes);
// app.use('/presenca', presencaRoutes);
// app.use('/api', inscricaoRoutes);


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`API rodando na porta ${PORT}`);
// });
import express from 'express';
import cors from 'cors';

import veiculosRoutes from './routes/veiculos.js';
import usuariosRoutes from './routes/usuarios.js'; 
import motoristasRoutes from './routes/motoristas.js';
import loginRoute from './routes/login.js';
import adminLogin from './routes/adminLogin.js';
import rotas from './routes/rotas.js';
import localizacaoRoutes from './routes/localizacaoRoutes.js';
import linhasRoutes from './routes/CriarLinhaRoutes.js';
import inscricaoRoutes from './routes/InscricaoRoutes.js';
import presencaRoutes from './routes/presencaRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/veiculos', veiculosRoutes);  
app.use('/api/usuarios', usuariosRoutes);  
app.use('/api', motoristasRoutes);
app.use('/api', loginRoute); 
app.use('/api', adminLogin);
app.use('/api', rotas);
app.use('/localizacao', localizacaoRoutes);
app.use('/api/linhas', linhasRoutes);
app.use('/presenca', presencaRoutes);
app.use('/api', inscricaoRoutes);



// Exporta o app para a Vercel poder usá-lo como handler
export default app;
