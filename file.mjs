import {
  mkdir,
  appendFile,
  readFile,
  unlink,
  writeFile,
} from "node:fs/promises";

// Write "Hello, World!" to data.txt
await writeFile("data.txt", "Hello, World!");
// Append a new line with "banana"
await appendFile("data.txt", ". banana");
// Read the contents of data.txt

await unlink("file.txt"); // Delete the file if it exists

const NewFolder = new URL("./test/project/", import.meta.url);
const createDir = await mkdir(NewFolder, { recursive: true });

const contents = await readFile("data.txt", "utf-8");
console.log(contents);

// Create a new folder and write multiple files in it
for (let i = 1; i <= 5; i++) {
  const fileName = `file${i}.txt`;
  const filePath = new URL(fileName, NewFolder);
  await writeFile(filePath, `file ${i}`);
  console.log(`Created ${fileName} in ${NewFolder}`);
}

// Read the contents of the newly created files
for (let i = 1; i <= 5; i++) {
  const fileName = `file${i}.txt`;
  const filePath = new URL(fileName, NewFolder);
  const fileContents = await readFile(filePath, "utf-8");
  console.log(`Contents of ${fileName}: ${fileContents}`);
}
