const fs = require('fs');
const path = require('path');

const globalConfigPath = path.resolve(__dirname, 'config.json');
const globalConfig = require(globalConfigPath);

const templateGroup = globalConfig.selectedTemplateGroup;
const templateDir = path.resolve(__dirname, globalConfig.templateBaseDir, templateGroup);
const configPath = path.join(templateDir, 'config.json');

if (!fs.existsSync(configPath)) {
    process.exit(1); // Configuration for the group "${templateGroup}" not found.
}

const config = require(configPath);

function generateFileContent(templatePath, entityName) {
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
}

function createEntityFiles(entityName) {
    Object.entries(config.fileConfigs).forEach(([key, { dir, folderName, createFolder, fileName, template, disable }]) => {
        if (disable) return;

        const targetDir = createFolder
            ? path.join(dir, folderName.replace('{EntityName}', entityName))
            : dir;

        const absoluteTargetDir = path.resolve(process.cwd(), targetDir);
        const finalFileName = fileName.replace('{EntityName}', entityName);
        const templatePath = path.resolve(templateDir, template);

        if (!fs.existsSync(templatePath)) {
            return; // Template not found: ${templatePath}
        }

        const content = generateFileContent(templatePath, entityName);
        createFile(absoluteTargetDir, finalFileName, content);
    });
}

const [entityName] = process.argv.slice(2);

if (!entityName) {
    process.exit(1); // Please provide the entity name.
}

createEntityFiles(entityName);