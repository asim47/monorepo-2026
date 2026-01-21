import { FastifyRequest, FastifyReply } from 'fastify';

export const getHealth = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.code(200).send({ status: 'ok' });
};
