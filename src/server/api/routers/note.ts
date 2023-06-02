import { Prisma } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  createTRPCContext,
} from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ source: z.string(), content: z.string() }))
    .mutation(async ({ input: { source, content }, ctx }) => {
      return await ctx.prisma.note.create({
        data: { source, content, userId: ctx.session.user.id },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      return await ctx.prisma.note.delete({
        where: {
          id: id,
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({ id: z.string(), source: z.string(), content: z.string() })
    )
    .mutation(async ({ input: { id, source, content }, ctx }) => {
      return await ctx.prisma.note.update({
        where: {
          id: id,
        },
        data: {
          source,
          content,
        },
      });
    }),

  infiniteFeed: protectedProcedure
    .input(
      z.object({
        searchParam: z.string().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(
      async ({
        input: { limit = 10, cursor, searchParam = undefined },
        ctx,
      }) => {
        const currentUserId = ctx.session?.user.id;
        return await getInfiniteNotes({
          limit,
          ctx,
          cursor,
          whereClause:
            searchParam === undefined
              ? { userId: currentUserId }
              : {
                  userId: currentUserId,
                  OR: [
                    {
                      content: { contains: searchParam },
                    },
                    {
                      source: { contains: searchParam },
                    },
                  ],
                },
        });
      }
    ),

  randomFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        randomInt: z.number(),
      })
    )
    .query(async ({ input: { limit, randomInt }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      return await ctx.prisma.$queryRaw(
        Prisma.sql`SELECT id, source, content, createdAt FROM Note WHERE userId = ${currentUserId} ORDER BY RAND(${randomInt}) LIMIT ${limit}`
      );
    }),
});

async function getInfiniteNotes({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.NoteWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const data = await ctx.prisma.note.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      source: true,
      content: true,
      createdAt: true,
    },
  });

  let nextCursor: typeof cursor | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }

  return { notes: data, nextCursor };
}
