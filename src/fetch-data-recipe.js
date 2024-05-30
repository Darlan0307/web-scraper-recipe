import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

const url = "https://www.receiteria.com.br/receitas-de-jantar-simples/";

let browser;

async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    return browser;
  }
}

export async function FetchDataRecipe(indexPage) {
  try {
    await initBrowser();
    // constante das receitas
    const dataRecipes = [];

    // Criando uma pagina
    const page = await browser.newPage();

    // Acessando a pagina das receitas
    await page.goto(url, { waitUntil: "networkidle2", timeout: 300000 });

    // Selecionando apenas os links dos cards de cada receita
    const links = await page.$$eval(".shadow-sm", (el) =>
      el.map((link) => link.href)
    );

    const start = (indexPage - 1) * 10;
    const end = indexPage * 10;

    const linksTeste = links.slice(start, end);

    for (const link of linksTeste) {
      // Acessando varias paginas dinâmicamente
      await page.goto(link, { waitUntil: "load", timeout: 300000 });
      // Para cada pagina criar um objeto com as informações necessárias
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      const newRecipe = await page.evaluate(() => {
        const urlImage = document
          .querySelector(".superimg > img")
          ?.getAttribute("src");
        const name = document.querySelector(".title > h1")?.innerText;
        const portion =
          document.querySelectorAll(".align-middle")[0]?.innerText;
        const timer = document.querySelectorAll(".align-middle")[1]?.innerText;
        const elIngredients = document.querySelectorAll(
          ".ingredientes > ul > li > label"
        );
        const ingredients = [];
        for (let label of elIngredients) {
          ingredients.push(label.innerText);
        }

        const elPreparations = document.querySelectorAll(
          ".lista-preparo-1 > li > span"
        );
        const preparations = [];
        for (let span of elPreparations) {
          preparations.push(span.innerText);
        }

        return {
          urlImage,
          name,
          category: "jantar",
          portion,
          timer,
          ingredients,
          preparations,
        };
      });

      dataRecipes.push(newRecipe);
    }

    return {
      qtdLinks: links.length,
      dataPage: dataRecipes,
    };
  } catch (error) {
    throw error;
  }
}
