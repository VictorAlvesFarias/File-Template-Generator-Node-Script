const fs = require('fs');
const path = require('path');
const config = require('./config.json');

function generateFileContent(templatePath, entityName, dir) {
  let template = fs.readFileSync(templatePath, 'utf-8');

  const pascalCaseName = entityName.charAt(0).toUpperCase() + entityName.slice(1);

  template = template.replace(/{{EntityName}}/g, pascalCaseName);

  template = template.replace(/{{entityName}}/g, entityName.toLowerCase());

  return template;
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
  Object.entries(config.fileConfigs).forEach(([key, { dir, folderName, createFolder, fileName, template, disable }]) => {

    if (disable) {
      return
    }

    const targetDir = createFolder
      ? path.join(dir, folderName.replace('{EntityName}', entityName))
      : dir;

    const absoluteTargetDir = path.resolve(process.cwd(), targetDir);
    const finalFileName = fileName.replace('{EntityName}', entityName);
    const content = generateFileContent(path.resolve(__dirname, template), entityName, dir);

    createFile(absoluteTargetDir, finalFileName, content);
  });
}

const [entityName] = process.argv.slice(2);

if (!entityName) {
  console.error('Por favor, forneça o nome da entidade.');
  process.exit(1);
}

createEntityFiles(entityName);
