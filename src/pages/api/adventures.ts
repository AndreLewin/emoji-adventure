import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";
import { Adventure } from '@prisma/client'
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req
  const session = await unstable_getServerSession(req, res, authOptions)
  const userId = session?.user?.id ?? null

  switch (method) {
    case 'GET':
      // TODO: should be able to filter if should include own adventures
      const adventure = await prisma.adventure.findMany({
        orderBy: [{ createdAt: "desc" }],
        where: {
          OR: [
            {
              userId: userId ?? ""
            },
            {
              isAccessible: true
            },
          ]
        },
        select: {
          id: true,
          name: true,
          description: true
        },
      });
      res.status(200).json(adventure)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}