const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, 'templates');
const globalConfigPath = path.resolve(__dirname, 'config.json');

function listTemplateGroups() {
    const groups = fs.readdirSync(baseDir).filter((file) => fs.statSync(path.join(baseDir, file)).isDirectory());
    console.log('Available template groups:');
    groups.forEach((group) => console.log(`- ${group}`));
}

function setTemplateGroup(groupName) {
    if (!fs.existsSync(path.join(baseDir, groupName))) {
        console.error(`The group "${groupName}" does not exist.`);
        process.exit(1);
    }

    const globalConfig = require(globalConfigPath);
    const newConfig = { ...globalConfig, selectedTemplateGroup: groupName };

    fs.writeFileSync(globalConfigPath, JSON.stringify(newConfig, null, 2), 'utf-8');
    console.log(`Template group changed to: ${groupName}`);
}

function deleteTemplateGroup(groupName) {
    const groupPath = path.join(baseDir, groupName);

    if (!fs.existsSync(groupPath)) {
        console.error(`The group "${groupName}" does not exist.`);
        process.exit(1);
    }

    fs.rmSync(groupPath, { recursive: true, force: true });
    console.log(`Template group "${groupName}" has been removed.`);
}

function copyTemplateGroup(groupName, destinationPath) {
    const sourcePath = path.join(baseDir, groupName);
    const targetPath = path.resolve(destinationPath, groupName);

    if (!fs.existsSync(sourcePath)) {
        console.error(`The group "${groupName}" does not exist.`);
        process.exit(1);
    }

    if (fs.existsSync(targetPath)) {
        console.error(`The destination "${targetPath}" already contains a group with the same name.`);
        process.exit(1);
    }

    fs.cpSync(sourcePath, targetPath, { recursive: true });
    console.log(`Group "${groupName}" copied to "${targetPath}".`);
}

function addTemplateGroup(sourceDir, groupName) {
    console.log(sourceDir,groupName)
    const targetPath = path.join(baseDir, groupName);

    if (!fs.existsSync(sourceDir)) {
        console.error(`The directory "${sourceDir}" does not exist.`);
        process.exit(1);
    }

    if (fs.existsSync(targetPath)) {
        console.error(`The group "${groupName}" already exists.`);
        process.exit(1);
    }

console.log("eita ferro")

    fs.cpSync(sourceDir, targetPath, { recursive: true });
    console.log(`Group "${groupName}" added from "${sourceDir}".`);
}

const [command, param1, param2] = process.argv.slice(2);

switch (command) {
    case 'list':
        listTemplateGroups();
        break;
    case 'set':
        if (!param1) {
            console.error('Usage: set <group-name>');
            process.exit(1);
        }
        setTemplateGroup(param1);
        break;
    case 'delete':
        if (!param1) {
            console.error('Usage: delete <group-name>');
            process.exit(1);
        }
        deleteTemplateGroup(param1);
        break;
    case 'copy':
        if (!param1 || !param2) {
            console.error('Usage: copy <group> <destination>');
            process.exit(1);
        }
        copyTemplateGroup(param1, param2);
        break;
    case 'add':
        console.log(param1,param2)
        console.log("TESTEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        if (!param1 || !param2) {
            console.error('Usage: add <source-path> <group-name>');
            process.exit(1);
        }
        addTemplateGroup(param1, param2);
        break;
    default:
        console.error('Unknown command. Use: list, set, delete, copy, add.');
        break;
}