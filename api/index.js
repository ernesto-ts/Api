// import app from '../server.js';
// import serverless from 'serverless-http';

// export const handler = serverless(app);
import app from '../server.js';
import serverless from 'serverless-http';
const port = process.env.PORT || 3000;

export default serverless(app);
