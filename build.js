const fs = require("fs").promises;
const glob = require("glob");
const path = require("path");
const handlebars = require("handlebars");
const { generateKeyPair } = require("crypto");
async function index() {
  return new Promise((resolve, reject) => {
    glob("node_modules/entypo/src/Entypo/*.svg", async (er, files) => {
      if (files.length > 0) {
        const icons = [];
        for (const iterator of files) {
          // read properties
          let iconName = iterator.replace(".svg", "").split("/");
          iconName = iconName[iconName.length - 1];
          const temp = iconName.split("-");
          iconName = "";
          temp.forEach((element) => {
            iconName += element.charAt(0).toUpperCase() + element.slice(1);
          });
          icons.push(iconName);
          let icon = await fs.readFile(path.resolve(iterator), "utf8");
          icon = icon.split('dtd">');
          icon = icon[1];
          const source = await fs.readFile(
            path.resolve(`${__dirname}/component-template.vue`),
            "utf8"
          );

          const template = handlebars.compile(source);

          const contents = template({ icon: icon });

          const exist = await fs.readdir("components").catch(async (e) => {
            await fs.mkdir("components", { recursive: true });
            console.log("folder created");
          });
          await fs.writeFile(`components/${iconName}.vue`, contents);
        }
        resolve(icons);
      } else {
        console.error("icon not found");
      }
    });
  });
}

async function generate() {
  await index().catch((e) => console.error(e));
}

generate();
