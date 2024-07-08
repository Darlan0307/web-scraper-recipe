import express from "express";
import cors from "cors";
import { FetchDataRecipe } from "../src/fetch-data-recipe.js";
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/fetch-data-recipe", async (req, res) => {
  const dataRecipes = await FetchDataRecipe(10);
  res.json({ data: dataRecipes });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;
