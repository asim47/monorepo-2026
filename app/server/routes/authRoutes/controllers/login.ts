import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginInput } from '../../../schemas/authSchemas';
import { prisma } from '../../../db';
import { verifyPassword } from '../../../helpers/auth/bcrypt';
import { generateToken } from '../../../helpers/auth/jwt';
import { HttpError } from '../../../utils/HttpError';

export const login = async (request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) => {
  const body = request.body;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  // Check if user is blocked
  if (user.status === 'Blocked') {
    throw new HttpError(403, 'Your account has been blocked');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(body.password, user.password);

  if (!isPasswordValid) {
    throw new HttpError(401, 'Invalid email or password');
  }

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  // Return response (exclude password)
  const { password: _, ...userWithoutPassword } = user;

  return reply.code(200).send({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: userWithoutPassword,
    },
  });
};
