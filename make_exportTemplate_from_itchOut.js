// bing chat code :p, not the most readable and the if conditions are far from perfect
// with node, make a copy of the folder "itchOut" with all its content, and place it in public/exportTemp

const fs = require('fs');
const path = require('path');

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

fs.readFile(indexHtmlPath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const regex = /<link.*?href="(.*?)".*?>/g;
  let match;

  while ((match = regex.exec(data)) !== null) {
    const cssFilePath = match[1];

    if (cssFilePath.endsWith('.css')) {
      cssFilesUsed.push(cssFilePath.split('/').pop());
    }
  }

  fs.readdir(cssFolderPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const cssFilePath = path.join(cssFolderPath, file);

      if (file.endsWith('.css') && !cssFilesUsed.includes(file)) {
        fs.unlinkSync(cssFilePath);
      }
    });

    //// ??? because Vercel hides /public/exportTemplate/_next for some reason,
    //// ??? there is still the problem after renaming....
    // so we need to give the directory an other name and changes the references to it

    // with node, rename directory `public\exportTemp` in `public\exportTemplate`
    const oldPath = './public/exportTemp/_next';
    const newPath = './public/exportTemp/kato';
    fs.renameSync(oldPath, newPath);

    // update the references
    // in index.html
    const filePath = './public/exportTemp/index.html';
    const data = fs.readFileSync(filePath, 'utf8');
    const result = data.replace(/_next\/static/g, 'kato/static');
    fs.writeFileSync(filePath, result, 'utf8');

    // in next/static/chunks/webpack....js
    const directoryPath = './public/exportTemp/kato/static/chunks';
    const files2 = fs.readdirSync(directoryPath);

    for (let i = 0; i < files2.length; i++) {
      const file = files2[i];

      if (file.match(/^webpack.*\.js$/)) {
        const filePath = path.join(directoryPath, file);
        const fileData = fs.readFileSync(filePath, 'utf8');
        const result = fileData.replace(/_next/g, 'kato');
        fs.writeFileSync(filePath, result);
        break;
      }
    }

    // with node, rename directory `public\exportTemp` in `public\exportTemplate`
    const oldPath2 = './public/exportTemp';
    const newPath2 = './public/exportTemplate';

    fs.rename(oldPath2, newPath2, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`Successfully built ${newPath2}`);
    });
  });
});

// TODO: remove the unused chunks/*.js to make the export template smaller
// read `public\exportTemp\index.html` to find all js files that are used inside it. Then remove all js files inside `public\exportTemp\_next\static\chunks` that are not used.

// this last part was deactivated because it's hard to detect the usage of some .js files
// like in \"chunks\":[\"862:862-76ac2828155d9e46\",\"488:app/adventure/[adventureId]/page-774bb1b7c45f98e0\"],



// const jsFolderPath = './public/exportTemp/_next/static/chunks';

// const jsFilesUsed = [];

// fs.readFile(indexHtmlPath, 'utf8', (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   const regex = /<script.*?src="(.*?)".*?><\/script>/g;
//   let match;

//   while ((match = regex.exec(data)) !== null) {
//     const jsFilePath = match[1];

//     if (jsFilePath.endsWith('.js')) {
//       jsFilesUsed.push(jsFilePath.split('/').pop());
//     }
//   }

//   fs.readdir(jsFolderPath, (err, files) => {
//     if (err) {
//       console.error(err);
//       return;
//     }

//     files.forEach((file) => {
//       const jsFilePath = path.join(jsFolderPath, file);

//       if (file.endsWith('.js') && !jsFilesUsed.includes(file)) {
//         fs.unlinkSync(jsFilePath);
//       }
//     });
//   });
// });

