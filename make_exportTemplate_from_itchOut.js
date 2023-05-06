// bing chat code :p, not the most readable and the if conditions are far from perfect
// with node, make a copy of the folder "itchOut" with all its content, and place it in public/exportTemp

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// remove the directory `public\exportTemp\_next\static\chunks\pages`

deleteFolderRecursive('./public/exportTemp');
deleteFolderRecursive('./public/exportTemplate');

///

const source = './itchOut';
const destination = './public/exportTemp';

fs.mkdirSync(destination, { recursive: true });
fs.readdirSync(source).forEach((file) => {
  const sourcePath = path.join(source, file);
  const destinationPath = path.join(destination, file);

  if (fs.lstatSync(sourcePath).isDirectory()) {
    fs.mkdirSync(destinationPath);
    copyFolderRecursiveSync(sourcePath, destinationPath);
  } else {
    fs.copyFileSync(sourcePath, destinationPath);
  }
});
function copyFolderRecursiveSync(source, target) {
  fs.readdirSync(source).forEach((file) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      fs.mkdirSync(targetPath);
      copyFolderRecursiveSync(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

// remove all folders except the folders "_next" and "adventure" and their content

const folderPath2 = './public/exportTemp';

fs.readdirSync(folderPath2).forEach((file) => {
  const filePath = path.join(folderPath2, file);

  if (fs.lstatSync(filePath).isDirectory() && file !== '_next' && file !== 'adventure') {
    deleteFolderRecursive(filePath);
  } else if (file !== '_next' && file !== 'adventure') {
    fs.unlinkSync(filePath);
  }
});

function deleteFolderRecursive(folderPath2) {
  if (fs.existsSync(folderPath2)) {
    fs.readdirSync(folderPath2).forEach((file) => {
      const curPath = path.join(folderPath2, file);

      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(folderPath2);
  }
}

// then inside `./public/exportTemp`, find the html file inside the directory `adventure`. Rename this file `index.html`, and then move it to the directory `./public/exportTemp`

const sourcePath3 = './public/exportTemp/adventure';
const destinationPath3 = './public/exportTemp';

fs.readdirSync(sourcePath3).forEach((file) => {
  const filePath = path.join(sourcePath3, file);

  if (path.extname(filePath) === '.html') {
    fs.renameSync(filePath, path.join(destinationPath3, 'index.html'));
  }
});

// after that, delete the directory `./public/exportTemp/adventure`

const folderPath4 = './public/exportTemp/adventure';

deleteFolderRecursive(folderPath4);

function deleteFolderRecursive(folderPath4) {
  if (fs.existsSync(folderPath4)) {
    fs.readdirSync(folderPath4).forEach((file) => {
      const curPath = path.join(folderPath4, file);

      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(folderPath4);
  }
}

// delete every directory in `./public/exportTemp/_next` that is not named "static".

const folderPath5 = './public/exportTemp/_next';

fs.readdirSync(folderPath5).forEach((file) => {
  const filePath = path.join(folderPath5, file);

  if (fs.lstatSync(filePath).isDirectory() && file !== 'static') {
    deleteFolderRecursive(filePath);
  }
});

// delete every directory in `public\exportTemp\_next\static` that is not named "chunks" or "css"

const folderPath6 = './public/exportTemp/_next/static';

fs.readdirSync(folderPath6).forEach((file) => {
  const filePath = path.join(folderPath6, file);

  if (fs.lstatSync(filePath).isDirectory() && file !== 'chunks' && file !== 'css') {
    deleteFolderRecursive(filePath);
  }
});

// remove the directory `public\exportTemp\_next\static\chunks\pages`

const folderPath7 = './public/exportTemp/_next/static/chunks/pages';

deleteFolderRecursive(folderPath7);

// read `public\exportTemp\index.html` to see which css files are used,
// and then in `public\exportTemp\_next\static\css`, remove all css files that are not used

const indexHtmlPath = './public/exportTemp/index.html';
const cssFolderPath = './public/exportTemp/_next/static/css';

const cssFilesUsed = [];

const data = fs.readFileSync(indexHtmlPath, 'utf8');

const regex = /<link.*?href="(.*?)".*?>/g;
let match;

while ((match = regex.exec(data)) !== null) {
  const cssFilePath = match[1];

  if (cssFilePath.endsWith('.css')) {
    cssFilesUsed.push(cssFilePath.split('/').pop());
  }
}

const files = fs.readdirSync(cssFolderPath);

files.forEach((file) => {
  const cssFilePath = path.join(cssFolderPath, file);

  if (file.endsWith('.css') && !cssFilesUsed.includes(file)) {
    fs.unlinkSync(cssFilePath);
  }
});

// find the name of script file that is used as a chunk by app/adventure/[adventureId]
const data3 = fs.readFileSync(indexHtmlPath, 'utf8');

const regex3 = /(\w*-\w*)\\",\\"\w*:app\/adventure\/\[adventureId\]/;
const match3 = regex3.exec(data3);
const pageScriptName = match3[1];

// find the other scripts that are still used (they are inside script-s elements)
// so that we can remove the unused chunks/*.js to make the export template smaller
// read `public\exportTemp\index.html` to find all js files that are used inside it. Then remove all js files inside `public\exportTemp\_next\static\chunks` that are not used.

const jsFolderPath = './public/exportTemp/_next/static/chunks';

const jsFilesUsed = [`${pageScriptName}.js`];

const data2 = fs.readFileSync(indexHtmlPath, 'utf8');

const regex2 = /<script.*?src="(.*?)".*?><\/script>/g;
let match2;

while ((match2 = regex2.exec(data2)) !== null) {
  const jsFilePath = match2[1];

  if (jsFilePath.endsWith('.js')) {
    jsFilesUsed.push(jsFilePath.split('/').pop());
  }
}

const files2 = fs.readdirSync(jsFolderPath);

files2.forEach((file) => {
  const jsFilePath = path.join(jsFolderPath, file);

  if (file.endsWith('.js') && !jsFilesUsed.includes(file)) {
    fs.unlinkSync(jsFilePath);
  }
});

// zip "public/exportTemp" into "public/exportTemplate.zip"
// save in a zip because Vercel hides subdirectory of public/

const output = fs.createWriteStream('./public/exportTemplate.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    console.log(err);
  } else {
    throw err;
  }
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(output);

archive.directory("./public/exportTemp", false);

archive.finalize();
