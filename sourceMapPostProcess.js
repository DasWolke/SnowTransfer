const fs = require("fs");
const path = require("path");
const config = require("./tsconfig.json");
const oneLineCommentRegex = /\t* *\/\/.+\n?/g;
const multiLineCommentRegex = /\t*\/\*\*[\S\s]+?\*\/\n?/gm;

const toSrcMapPath = path.join(__dirname, `${config.compilerOptions.outDir}/index.js.map`);

/** @type {{ version: number, sources: Array<string>, names: Array<string>, mappings: Array<string>, sourcesContent: Array<string> }} */
const srcMap = JSON.parse(fs.readFileSync(toSrcMapPath, { encoding: "utf8" }));

/** @type {Array<string>} */
const newContent = [];

for (const content of srcMap.sourcesContent) {
	const removed = content.replace(multiLineCommentRegex, match => "\r\n".repeat(match.split("\n").length - 1)).replace(oneLineCommentRegex, "");
	newContent.push(removed);
}

srcMap.sourcesContent = newContent;

fs.writeFileSync(toSrcMapPath, JSON.stringify(srcMap));
const stat = fs.statSync(toSrcMapPath);
console.log(`Done removing comments from src maps. New sourcemap size: ${(stat.size / 1024).toFixed(2)} KB`);
