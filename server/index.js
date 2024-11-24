import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import router from "./controllers/index.js";
import { sanitizeInput } from "./middlewares/xss.middleware.js";
import { sequelize } from "./models/index.js";
import WebSocketServer from "./ws/WebSocketServer.js";
import { expressMiddleware } from '@apollo/server/express4';
import { createApolloServer } from "./graphql.js";
import checkToken from "./middlewares/auth.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

const httpServer = createServer(app);
const wsServer = new WebSocketServer(httpServer);

app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use('/graphql', expressMiddleware(await createApolloServer(), { context: async ({ req, res }) => {
  await checkToken(req, res, () => {})
  return { user: req.user }
} }));

app.use("/api", sanitizeInput, router);

await sequelize.sync({ force: false });

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { wsServer };