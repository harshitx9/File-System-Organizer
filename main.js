let path = require("path");
let fs = require("fs");
let inputArr = process.argv.slice(2);
//commands
//node main.js organize "/Users/harshit/Downloads"
//node main.js help

let command = inputArr[0];

switch (command) {
    case "organize":
        organizeFn(inputArr[1]);
        deleteFiles(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Not a valid command. Enter 'node main.js help'");
        break;
}

function organizeFn(dirPath) {
    //Steps:
    //input-> directory path given
    //create-> organized_files directory
    //check all files category in input directory
    //copy files to that organized directory
    //delete the copied files and folders
    if (dirPath == undefined) {
        console.log("Kindly enter the path");
        return;
    }
    let doesExist = fs.existsSync(dirPath);
    if (doesExist) {
        let destPath = path.join(dirPath, "organised_files");
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
        }
        organizeHelper(dirPath, destPath);

    } else {
        console.log("Kindly enter the valid path");
        return;
    }

}

function organizeHelper(src, dest) {
    let childNames = fs.readdirSync(src);
    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile && childNames[i] != ".DS_Store" && childNames[i] != ".localized") {
            let category = getCategory(childNames[i]);
            sendFiles(childAddress, dest, category);

        } else if (fs.lstatSync(childAddress).isDirectory()) {
            //for folder--> used recursion
            organizeHelper(childAddress, dest);

        }
    }
}

function getCategory(name) {
    let types = {
        media: ["mp4", "mkv", "jpg", "png", "mp3", "bmp", "jpeg", "svg"],
        archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
        documents: ["docx", "doc", "pdf", "xlsx", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "tex"],
        app: ["exe", "dmg", "pkg", "deb"]
    }

    let ext = path.extname(name);
    ext = ext.substring(1);
    for (let type in types) {
        let cTypeArr = types[type];
        for (let i = 0; i < cTypeArr.length; i++) {
            if (ext == cTypeArr[i]) {
                return type;
            }
        }
    }
    return "other";

}

function sendFiles(srcFilePath, dest, category) {
    let categorypath = path.join(dest, category);
    if (fs.existsSync(categorypath) == false) {
        fs.mkdirSync(categorypath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categorypath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    console.log(fileName, " cut and paste to ", category);
}

function deleteFiles(src) {
    let childNames = fs.readdirSync(src);
    for (let i = 0; i < childNames.length; i++) {
        if (childNames[i] != "organised_files") {
            fs.rmdirSync(path.join(src, childNames[i]), { recursive: true });
        }
    }
}

function helpFn() {
    console.log(`
    This command-line utility helps you to organize
    files and folders of the given directory/path. This utility also helps to 
    show the tree structure of the given directory.
    To show tree structure, you can enter the following command:
    node main.js tree "directoryPath"
    To organize the files and folders of the given directory path, enter command:
    node main.js organize "directoryPath"
    where directoryPath is address to folder in which you want to perform operations.
    For example for a user harshit, organize command in his Downloads folder will look like:
    node main.js organize "/Users/harshit/Downloads"`);
}
