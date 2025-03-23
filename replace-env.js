import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainJsPath = path.join(__dirname, "dist", "gorest-users-fe", "browser");

fs.readdir(mainJsPath, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  const mainJsFile = files.find(
    (file) => file.startsWith("main-") && file.endsWith(".js")
  );

  if (!mainJsFile) {
    console.error("Could not find main js file");
    return;
  }

  const filePath = path.join(mainJsPath, mainJsFile);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    let result = data;

    if (process.env.API_TOKEN) {
      result = result.replace(/\$\{API_TOKEN\}/g, process.env.API_TOKEN);
      console.log("Replaced API_TOKEN");
    } else {
      console.warn("API_TOKEN environment variable not found");
    }

    if (process.env.API_URL) {
      result = result.replace(/\$\{API_URL\}/g, process.env.API_URL);
      console.log("Replaced API_URL");
    } else {
      result = result.replace(
        /\$\{API_URL\}/g,
        "https://gorest.co.in/public/v2"
      );
      console.warn("API_URL environment variable not found, using default");
    }

    fs.writeFile(filePath, result, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Environment variables replaced successfully");
    });
  });
});
