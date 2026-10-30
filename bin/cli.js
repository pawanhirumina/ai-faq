#!/usr/bin/env node

import { cpSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const flavor = args[0] || "ts-tw";

const validFlavors = ["ts-tw", "js-tw", "ts-css", "js-css"];

if (!validFlavors.includes(flavor)) {
  console.error(`Invalid flavor: "${flavor}". Choose from: ${validFlavors.join(", ")}`);
  process.exit(1);
}

const sourceMap = {
  "ts-tw": "src/ts-tw/FaqAI.tsx",
  "js-tw": "src/js-tw/FaqAI.jsx",
  "ts-css": ["src/ts-css/FaqAI.tsx", "src/ts-css/FaqAI.css"],
  "js-css": ["src/js-css/FaqAI.jsx", "src/ts-css/FaqAI.css"],
};

const targetDir = resolve(process.cwd(), "src/components");
mkdirSync(targetDir, { recursive: true });

const filesToCopy = sourceMap[flavor];

if (Array.isArray(filesToCopy)) {
  filesToCopy.forEach((file) => {
    const fileName = file.split("/").pop();
    cpSync(resolve(__dirname, "..", file), resolve(targetDir, fileName));
    console.log(`Successfully installed ${fileName} to src/components/`);
  });
} else {
  const fileName = filesToCopy.split("/").pop();
  cpSync(resolve(__dirname, "..", filesToCopy), resolve(targetDir, fileName));
  console.log(`Successfully installed ${fileName} to src/components/`);
}

console.log("\nNext steps:");
console.log("1. Make sure you have installed peer dependencies: npm i framer-motion lucide-react");
console.log("2. Import and use your FaqAI component!");
