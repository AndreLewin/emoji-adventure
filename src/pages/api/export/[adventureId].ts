import { type NextApiRequest, type NextApiResponse } from "next";
import fs from 'fs';
import JSZip from "jszip";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../server/db/client"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { query, method, body } = req
  const adventureId = query.adventureId as string

  const session = await unstable_getServerSession(req, res, authOptions)
  const userId = session?.user?.id ?? null

  const adventure = await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      // you can export only your adventure
      userId: userId ?? ""
    }
  });

  if (adventure === null) return res.status(400).json({ error: 'Could not export adventure' })

  fs.readFile(process.cwd() + `/public/exportTemplate.zip`, function (err, data) {
    if (err) throw err;

    JSZip.loadAsync(data).then(async function (zip) {
      const oldIndexHtmlString = await zip.file("index.html")!.async("string");

      // replace adventure
      let replacement = JSON.stringify(JSON.stringify(adventure));
      replacement = replacement.substring(1, replacement.length - 1);
      let newIndexHtmlString = oldIndexHtmlString.replace(/\{\\"adventure\\":(.*)\}\]\}\]\}\]/, `{\\"adventure\\":${replacement}}]}]}]`);
      // replace name
      newIndexHtmlString = newIndexHtmlString.replace(/DEMO-ADVENTURE/g, adventure.name ?? "Name");
      // replace description
      newIndexHtmlString = newIndexHtmlString.replace(/DEMO-DESCRIPTION/g, adventure.description ?? "Description");

      zip.file('index.html', newIndexHtmlString);

      const data = await zip.generateAsync({
        type: 'nodebuffer', compression: "DEFLATE",
        compressionOptions: {
          level: 9
        }
      });
      res.setHeader('Content-Disposition', 'attachment; filename="export.zip"');
      res.setHeader('Content-Type', 'application/zip');
      res.send(data);
    });
  });
}
