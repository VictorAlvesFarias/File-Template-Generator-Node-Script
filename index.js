const fs = require('fs');
const path = require('path');
const config = require('./config.json');

function generateFileContent(templatePath, entityName, dir) {
  let template = fs.readFileSync(templatePath, 'utf-8');
  
  template = template.replace(/{{EntityName}}/g, entityName);
  template = template.replace(/{{Namespace}}/g, getNamespace(dir.split("/").join(".")));

  return template;
}

function getNamespace(entityName) {
  return `${config.baseNamespace}.${entityName}`;  
}

function createFile(directory, fileName, content) {
  const absoluteDirectory = path.resolve(process.cwd(), directory);

  if (!fs.existsSync(absoluteDirectory)) {
    fs.mkdirSync(absoluteDirectory, { recursive: true });
  }

  const filePath = path.join(absoluteDirectory, fileName);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Arquivo criado: ${filePath}`);
}

function createEntityFiles(entityName) {
  Object.entries(config.fileConfigs).forEach(([key, { dir, folderName, createFolder, fileName, template }]) => {
    const targetDir = createFolder
      ? path.join(dir, folderName.replace('{EntityName}', entityName))
      : dir;

    const absoluteTargetDir = path.resolve(process.cwd(), targetDir);
    const finalFileName = fileName.replace('{EntityName}', entityName);
    const content = generateFileContent(path.resolve(__dirname,template), entityName, dir);

    createFile(absoluteTargetDir, finalFileName, content);
  });
}

const [entityName] = process.argv.slice(2);

if (!entityName) {
  console.error('Por favor, forneça o nome da entidade.');
  process.exit(1);
}

createEntityFiles(entityName);
