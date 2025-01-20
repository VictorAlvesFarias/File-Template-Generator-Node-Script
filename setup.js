const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const programFilesPath = process.env['ProgramFiles'] || 'C:\\Program Files';
const targetDir = path.join(programFilesPath, 'FileGenerator');

function setup() {
  // Copiar o projeto para o Program Files
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.cpSync(__dirname, targetDir, { recursive: true });
    console.log(`Projeto copiado para: ${targetDir}`);
  } else {
    console.log('O projeto já está instalado no Program Files.');
  }

  // Adicionar ao PATH no sistema
  try {
    // Adiciona o diretório ao PATH permanentemente
    child_process.execSync(`setx PATH "%PATH%;${targetDir}" /M`, { stdio: 'inherit' });
    console.log(`Caminho adicionado ao PATH com sucesso.`);
  } catch (error) {
    console.error(
      'Erro ao adicionar o caminho ao PATH. Execute como administrador para definir variável no sistema.'
    );
    console.error(error.message);
  }
}

setup();
