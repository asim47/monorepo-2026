import { FastifyReply } from 'fastify';
import { prisma } from '../../../db';
import { AuthenticatedRequest } from '../../../middleware/isAuthenticated';

export const getUsers = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  // Fetch users from database using Prisma (exclude passwords)
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Prisma returns Date objects, Fastify will serialize them to ISO strings
  return reply.code(200).send({
    success: true,
    data: users,
    count: users.length,
  });
};
