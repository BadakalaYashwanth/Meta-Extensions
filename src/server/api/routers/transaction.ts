import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { transactions } from "~/server/db/schema";

export const transactionsRouter = createTRPCRouter({
  addTransaction: publicProcedure
    .input(
      z.object({
        transactionHash: z.string(),
        userAddress: z.string(),
        amount: z.string(),
        type: z.string(),
        tokenId: z.number(),
        fees: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(transactions).values({
        ...input,
        createdAt: new Date(),
      });
    }),

  getTransactionsByToken: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.transactions.findMany({
        where: eq(transactions.tokenId, input.id),
        orderBy: [desc(transactions.createdAt)],
      });
    }),

  getAllTransactions: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.transactions.findMany();
  }),

  getLatestTransactions: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.transactions.findMany({
      orderBy: [desc(transactions.createdAt)],
      with: {
        token: true,
      },
    });
  }),
});
