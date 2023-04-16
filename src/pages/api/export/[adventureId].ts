import { type NextApiRequest, type NextApiResponse } from "next";
import fs from 'fs';
import { Readable } from "stream";
import JSZip from "jszip";
import path from 'path';


export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { query, method, body } = req
  const adventureId = query.adventureId as string

  const zip = new JSZip();

  // create a virtual "export" folder for the export
  const folder = zip.folder('export')!;

  // put all files from public/exportTemplate inside it (except index.html, because we will change it)
  const addFile = (filePath: any) => {
    console.log("filePath | [adventureId].ts l19", filePath)

    if (filePath === (process.cwd() + `/public/exportTemplate/index.html`)) return

    const stats = fs.statSync(filePath);
    console.log("stats | [adventureId].ts l24", stats)


    if (stats.isFile()) {
      const data = fs.readFileSync(filePath);
      const relativePath = path.relative(process.cwd() + '/public/exportTemplate', filePath);
      console.log("relativePath | [adventureId].ts l26", relativePath)

      folder.file(relativePath, data);
    } else if (stats.isDirectory()) {
      const relativePath = path.relative(process.cwd() + '/public/exportTemplate', filePath);
      console.log("relativePath | [adventureId].ts l31", relativePath)

      const subFolder = folder.folder(relativePath);
      const subFiles = fs.readdirSync(filePath);
      console.log("subFiles | [adventureId].ts l39", subFiles)

      for (const file of subFiles) {
        addFile(path.join(filePath, file));
      }
    }
  };
  addFile(process.cwd() + '/public/exportTemplate');

  // add index.html to the virtual folder using the data of the exported adventure
  const oldIndexString = fs.readFileSync(process.cwd() + '/public/exportTemplate/index.html', 'utf8');
  // TODO: check on ownership
  // TODO: fetch adventure (cf api/adventure/[adventureId].ts)
  // TODO: replace title, description and script of index.html
  const newIndexString = oldIndexString.replace(/DEMO-ADVENTURE/g, adventureId);
  folder.file('index.html', newIndexString);

  // send the .zip
  const data = await folder.generateAsync({ type: 'nodebuffer' });
  res.setHeader('Content-Disposition', 'attachment; filename="export.zip"');
  res.setHeader('Content-Type', 'application/zip');
  res.send(data);
}
