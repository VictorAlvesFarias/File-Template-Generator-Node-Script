const fs = require('fs');
const path = require('path');

const baseDir = process.env.FILE_GENERATOR_HOME;

if (!baseDir) {
  console.error('A variável de ambiente "FILE_GENERATOR_HOME" não está configurada.');
  process.exit(1);
}

const configPath = path.join(baseDir, 'config.json');

function addTemplate(templateName, templatePath) {
  const config = require(configPath);

  if (!fs.existsSync(templatePath)) {
    console.error(`Template não encontrado no caminho: ${templatePath}`);
    process.exit(1);
  }

  config.fileConfigs[templateName] = {
    dir: "./Custom/Templates",
    folderName: "",
    createFolder: false,
    fileName: `${templateName}.txt`,
    template: path.relative(baseDir, templatePath)
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`Template "${templateName}" adicionado com sucesso.`);
}

function removeTemplate(templateName) {
  const config = require(configPath);

  if (!config.fileConfigs[templateName]) {
    console.error(`Template "${templateName}" não existe.`);
    process.exit(1);
  }

  delete config.fileConfigs[templateName];
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`Template "${templateName}" removido com sucesso.`);
}

function listTemplates() {
  const config = require(configPath);
  console.log('Templates disponíveis:');
  Object.keys(config.fileConfigs).forEach((key) => {
    console.log(`- ${key}`);
  });
}

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'add':
    if (args.length < 2) {
      console.error('Uso: add <nome-do-template> <caminho-do-template>');
      process.exit(1);
    }
    addTemplate(args[0], args[1]);
    break;

  case 'remove':
    if (!args[0]) {
      console.error('Uso: remove <nome-do-template>');
      process.exit(1);
    }
    removeTemplate(args[0]);
    break;

  case 'list':
    listTemplates();
    break;

  default:
    console.error('Comando desconhecido. Use: add, remove ou list.');
    break;
}
