import { FastifyRequest, FastifyReply } from 'fastify';
import { SignupInput } from '../../../schemas/authSchemas';
import { prisma } from '../../../db';
import { hashPassword } from '../../../helpers/auth/bcrypt';
import { generateToken } from '../../../helpers/auth/jwt';
import { HttpError } from '../../../utils/HttpError';

export const signup = async (
  request: FastifyRequest<{ Body: SignupInput }>,
  reply: FastifyReply,
) => {
  const body = request.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    throw new HttpError(409, 'User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(body.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    },
  });

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  // Return response (exclude password)
  const { password: _, ...userWithoutPassword } = user;

  return reply.code(201).send({
    success: true,
    message: 'User created successfully',
    data: {
      token,
      user: userWithoutPassword,
    },
  });
};
