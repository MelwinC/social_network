import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import router from "./controllers/index.js";
import sequelize from "./utils/sequelize.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("uploads"));

app.use(express.json());
app.use("/api", router);

await sequelize.sync({force: true});

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
