import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";
import { Adventure } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req
  switch (method) {
    case 'GET':
      const adventure = await prisma.adventure.findMany({
        orderBy: [{ createdAt: "desc" }]
      });
      res.status(200).json(adventure)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}