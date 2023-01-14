import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../../server/db/client"
import { Adventure } from '@prisma/client'
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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
      const adventure = await prisma.adventure.findMany({
        where: {
          OR: [
            {
              id: adventureId,
              userId: userId ?? ""
            },
            {
              id: adventureId,
              isAccessible: true
            },
          ]
        }
      });
      if (adventure) {
        res.status(200).json(adventure)
      } else {
        res.status(404).json(`Could not find adventure`)
      }
      break
    case 'PUT':
      if (userId === null) {
        res.status(401).json("You need to be authenticated to perform this action")
        break;
      }
      const updatedAdventure = await prisma.adventure.updateMany({
        where: {
          id: adventureId,
          userId
        },
        // @ts-ignore
        data: { ...body }
      })
      res.status(200).json(updatedAdventure)
      break
    case 'DELETE':
      if (userId === null) {
        res.status(401).json("You need to be authenticated to perform this action")
        break;
      }
      // xxx deleteMany is used instead of delete so "userId" can be used to check if the user owns the adventure
      // seriously Prisma, correct this... https://github.com/prisma/prisma/issues/7290
      const deletedAdventure = await prisma.adventure.deleteMany({
        where: {
          id: adventureId,
          userId
        }
      });
      res.status(200).json(deletedAdventure)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).json(`Method ${method} Not Allowed`)
  }
}
