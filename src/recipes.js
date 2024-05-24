import puppeteer from "puppeteer";

const url = "https://www.receiteria.com.br/receitas-de-jantar-simples/";

async function main() {
  // constante das receitas
  const dataRecipes = [];

  // Criando uma instância do chrome
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Criando uma pagina
  const page = await browser.newPage();

  // Acessando a pagina das receitas
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  // Selecionando apenas os links dos cards de cada receita
  const links = await page.$$eval(".shadow-sm", (el) =>
    el.map((link) => link.href)
  );

  const linksTeste = links.slice(0, 2);

  for (const link of linksTeste) {
    // Acessando varias paginas dinâmicamente
    await page.goto(link, { waitUntil: "networkidle2", timeout: 60000 });

    // Para cada pagina criar um objeto com as informações necessárias
    const newRecipe = await page.evaluate(() => {
      const urlImage = document
        .querySelector(".superimg > img")
        ?.getAttribute("src");
      const name = document.querySelector(".title > h1")?.innerText;
      const portion = document.querySelectorAll(".align-middle")[0]?.innerText;
      const timer = document.querySelectorAll(".align-middle")[1]?.innerText;
      // TODO aplicar logica para pegar todos os ingredientes
      const ingredients = document.querySelectorAll(
        ".ingredientes > ul > li > label"
      )[0]?.innerText;

      return {
        urlImage,
        name,
        portion,
        timer,
        ingredients,
      };
    });

    dataRecipes.push(newRecipe);
  }

  console.log(dataRecipes);

  // Fechando o chrome para evitar vazamento de memória
  await browser.close();
}

main();
