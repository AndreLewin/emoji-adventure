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
    if (filePath === `./public/exportTemplate/index.html`) return

    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      const data = fs.readFileSync(filePath);
      folder.file(path.relative('./public/exportTemplate', filePath), data);
    } else if (stats.isDirectory()) {
      const subFolder = folder.folder(path.relative('./public/exportTemplate', filePath));
      for (const file of fs.readdirSync(filePath)) {
        addFile(path.join(filePath, file));
      }
    }
  };
  addFile('./public/exportTemplate');

  // add index.html to the virtual folder using the data of the exported adventure
  const oldIndexString = fs.readFileSync('./public/exportTemplate/index.html', 'utf8');
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
