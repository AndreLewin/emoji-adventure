import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../../server/db/client"
import { Adventure } from '@prisma/client'
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const isDefined = (x: unknown): boolean => {
  return x !== null && x !== undefined
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method, body } = req

  const adventureId = query.adventureId as string

  const session = await unstable_getServerSession(req, res, authOptions)
  const userId = session?.user?.id ?? null

  switch (method) {
    case 'GET':
      const adventure = await prisma.adventure.findUnique({
        where: { id: adventureId }
      });

      if (adventure) {
        res.status(200).json(adventure)
      } else {
        res.status(404).json(`Could not find adventure`)
      }
      break
    case 'PUT':
      const updatedAdventure = await prisma.adventure.update({
        where: { id: adventureId },
        // @ts-ignore
        data: { ...body }
      })
      res.status(200).json(updatedAdventure)
      break
    case 'DELETE':
      const deletedAdventure = await prisma.adventure.delete({
        where: { id: adventureId }
      });
      res.status(200).json(deletedAdventure)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).json(`Method ${method} Not Allowed`)
  }
}
