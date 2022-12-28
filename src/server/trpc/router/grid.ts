import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const gridRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  findUnique: publicProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.grid.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  findMany: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.grid.findMany({
      orderBy: [{ id: "desc" }]
    });
  }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional().nullable(),
          message: z.string().optional().nullable(),
          backgroundImage: z.string().optional().nullable(),
          colors: z.string().array().length(100).optional().nullable(),
          emojis: z.string().array().length(100).optional().nullable()
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const grid = await ctx.prisma.grid.update({
        where: { id },
        data: {
          ...data,
          colors: JSON.stringify(data.colors),
          emojis: JSON.stringify(data.emojis)
        },
      });

      return grid
    }),
  // delete: publicProcedure
  //   .input(z.object({ id: z.number() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const { id } = input;
  //     const todo = await ctx.prisma.card.delete({
  //       where: { id }
  //     });

  //     return todo;
  //   }),
  // generate: publicProcedure
  //   .mutation(async ({ ctx }) => {
  //     const newCard: Omit<Card, "id" | "createdAt"> = {
  //       text: "text",
  //       isCompleted: false
  //     }
  //     const newTask = await ctx.prisma.card.create({
  //       data: newCard
  //     })
  //     return newTask;
  //   }),
});
