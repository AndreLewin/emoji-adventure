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
          colors: z.string()
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const grid = await ctx.prisma.grid.update({
        where: { id },
        data,
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
