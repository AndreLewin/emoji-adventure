import { type NextApiRequest, type NextApiResponse } from "next";
import fs from 'fs';
import { Readable } from "stream";
import JSZip from "jszip";
import path from 'path';


export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { query, method, body } = req
  const adventureId = query.adventureId as string

  fs.readFile(process.cwd() + `/public/exportTemplate.zip`, function (err, data) {
    if (err) throw err;

    JSZip.loadAsync(data).then(async function (zip) {
      const oldIndexHtmlString = await zip.file("index.html")!.async("string");

      // TODO: check on ownership
      // TODO: fetch adventure (cf api/adventure/[adventureId].ts)
      // TODO: replace title, description and script of index.html
      const newIndexHtmlString = oldIndexHtmlString.replace(/DEMO-ADVENTURE/g, adventureId);
      zip.file('index.html', newIndexHtmlString);

      const data = await zip.generateAsync({ type: 'nodebuffer' });
      res.setHeader('Content-Disposition', 'attachment; filename="export.zip"');
      res.setHeader('Content-Type', 'application/zip');
      res.send(data);
    });
  });
}
