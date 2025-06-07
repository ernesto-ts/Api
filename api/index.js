import app from '../server.js';
import serverless from 'serverless-http';

export const handler = serverless(app);
// import app from '../server.js';
// import serverless from 'serverless-http';
// const port = process.env.PORT || 3000;
// app.get('/', (req, res) => {
//   res.send('Hello from the serverless function!');
// });
// export default serverless(app);
