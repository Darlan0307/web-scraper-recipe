import puppeteer from "puppeteer";

const url = "https://www.receiteria.com.br/receitas-de-jantar-simples/";

async function main() {
  const dataRecipes = [];

  const browser = await puppeteer.launch({
    devtools: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto(url);

  const links = await page.$$eval(".shadow-sm", (el) =>
    el.map((link) => link.href)
  );

  const linksTeste = links.slice(0, 2);

  for (const link of linksTeste) {
    await page.goto(link);

    const newRecipe = await page.evaluate(() => {
      const elImg = document
        .querySelector(".superimg > img")
        ?.getAttribute("src");
      const elTitle = document.querySelector(".title > h1")?.innerText;

      return {
        urlImage: elImg,
        name: elTitle,
      };
    });

    dataRecipes.push(newRecipe);
  }

  console.log(dataRecipes);

  await browser.close();
}

main();
