/* eslint-disable @typescript-eslint/no-unsafe-call */
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { token } from "~/server/db/schema";

export const tokenRouter = createTRPCRouter({
  addToken: publicProcedure
    .input(
      z.object({
        name: z.string(),
        ticker: z.string(),
        description: z.string(),
        twitter: z.string(),
        youtube: z.string(),
        website: z.string(),
        telegram: z.string(),
        userAddress: z.string(),
        image: z.string(),
        marketCap: z.number(),
        tokenAddress: z.string(),
        liquidity: z.number(),
        pairAddress: z.string(),
        isDeployed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(token)
        .values({
          ...input,
        })
        .returning({ id: token.id });
    }),

  getAllTokens: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.token.findMany();
  }),

  getOnetoken: publicProcedure
    .input(z.object({ tokenAddress: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.token.findFirst({
        where: eq(token.tokenAddress, input.tokenAddress),
      });
    }),
  getUserTokens: publicProcedure
    .input(z.object({ userAddress: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.token.findMany({
        where: eq(token.userAddress, input.userAddress),
      });
    }),
  updateToken: publicProcedure
    .input(
      z.object({
        id: z.number(),
        description: z.string().optional(),
        twitter: z.string().optional(),
        youtube: z.string().optional(),
        website: z.string().optional(),
        telegram: z.string().optional(),
        isDeployed: z.boolean().optional(),
        pairAddress: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(token)
        .set({
          description: input.description,
          twitter: input.twitter,
          youtube: input.youtube,
          website: input.website,
          telegram: input.telegram,
        })
        .where(eq(token.id, input.id));
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.token.findFirst({
        where: eq(token.id, input.id),
      });
    }),
  getLatestTokens: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.token.findMany({
      orderBy: (token, { desc }) => [desc(token.id)],
      limit: 5,
    });
  }),
});
