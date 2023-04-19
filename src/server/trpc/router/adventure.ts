import { Adventure } from ".prisma/client";
import { z } from "zod";
import { defaultAdventureFactory } from "../../../store";

import { router, publicProcedure } from "../trpc";

export const adventureRouter = router({
  findMany: publicProcedure
    .query(async ({ ctx }) => {
      const userId = ctx?.session?.user?.id ?? null
      const adventures = await ctx.prisma.adventure.findMany({
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
        }
      });
      return adventures.map(a => {
        // don't send the data field since it can be heavy
        const { data, ...rest } = a
        return rest
      })
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        emojiFavicon: z.string().optional()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.session?.user?.id ?? null
      if (userId === null) {
        return -1
      }
      const newAdventure: Omit<Adventure, "id" | "createdAt" | "updatedAt"> = {
        ...defaultAdventureFactory(),
        ...input,
        userId
      }
      return await ctx.prisma.adventure.create({
        data: newAdventure
      })
    }),
  find: publicProcedure
    .input(
      z.object({
        id: z.string()
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx?.session?.user?.id ?? null
      // xxx Prisma does not allow to use .findUnique if we search on isAccessible
      const foundAdventures = await ctx.prisma.adventure.findMany({
        where: {
          OR: [
            {
              id: input.id,
              userId: userId ?? ""
            },
            {
              id: input.id,
              isAccessible: true
            },
          ]
        }
      });
      return foundAdventures?.[0]
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          data: z.string().optional(),
          isAccessible: z.boolean().optional(),
          isPublished: z.boolean().optional(),
          emojiFavicon: z.string().optional()
        })
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.session?.user?.id ?? null
      if (userId === null) return null
      return await ctx.prisma.adventure.updateMany({
        where: {
          id: input.id,
          userId
        },
        data: { ...input.data }
      })
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.session?.user?.id ?? null
      if (userId === null) return null
      return await ctx.prisma.adventure.deleteMany({
        where: {
          id: input.id,
          userId
        }
      })
    })
});
