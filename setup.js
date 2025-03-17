const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const programFilesPath = process.env['ProgramFiles'] || 'C:\\Program Files';
const targetDirectory = path.join(programFilesPath, 'FileGenerator');

function configure() {
  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory, { recursive: true });
    fs.cpSync(__dirname, targetDirectory, { recursive: true });
  }

  try {
    child_process.execSync(`setx PATH "%PATH%;${targetDirectory}" /M`, { stdio: 'inherit' });
  } catch {}
}

configure();
