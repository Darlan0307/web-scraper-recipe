import express from "express";
import cors from "cors";
import { FetchDataRecipe } from "./fetch-data-recipe.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.status(200).json({ message: "running" });
});

app.get("/data", async (req, res) => {
  const { indexPage } = req.query;

  try {
    const { qtdLinks, dataPage } = await FetchDataRecipe(indexPage);

    res.status(200).json({ dataPage, qtdLinks });
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
});

const PORT = 9008;

app.listen(PORT, () => {
  console.log(`running in http://localhost:${PORT}`);
});
