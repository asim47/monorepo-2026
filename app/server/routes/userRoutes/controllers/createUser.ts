import { FastifyReply } from 'fastify';
import { CreateUserInput } from '../../../schemas/userSchemas';
import { prisma } from '../../../db';
import { hashPassword } from '../../../helpers/auth/bcrypt';
import { AuthenticatedRequest } from '../../../middleware/isAuthenticated';

export const createUser = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  const body = request.body as CreateUserInput; // Already validated by Fastify

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    return reply.code(409).send({
      success: false,
      message: 'User with this email already exists',
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(body.password);

  // Create user in database using Prisma
  // Status defaults to 'Active' in the database if not provided
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      ...(body.status && { status: body.status }), // Include status if provided
    },
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  // Prisma returns Date objects, Fastify will serialize them to ISO strings
  return reply.code(201).send({
    success: true,
    message: 'User created successfully',
    data: userWithoutPassword,
  });
};
