import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";
import { Adventure } from '@prisma/client'
import { defaultAdventureFactory } from "../../store";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req
  switch (method) {
    case 'POST':
      const session = await unstable_getServerSession(req, res, authOptions)

      const userId = session?.user?.id ?? null
      if (userId === null) {
        res.status(401).json("You need to be authenticated to perform this action")
        break;
      }

      const newAdventure: Omit<Adventure, "id" | "createdAt" | "updatedAt"> = {
        ...defaultAdventureFactory(),
        userId
      }

      const createdAdventure = await prisma.adventure.create({
        data: newAdventure
      })
      res.status(201).json(createdAdventure)
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}