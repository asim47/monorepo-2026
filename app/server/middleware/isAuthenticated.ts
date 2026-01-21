import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';
import { verifyToken, extractTokenFromHeader } from '../helpers/auth/jwt';
import { HttpError } from '../utils/HttpError';

export interface AuthenticatedRequest<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> extends FastifyRequest<RouteGeneric> {
  user?: {
    userId: number;
    email: string;
  };
}

/**
 * Authentication middleware to protect routes
 */
export async function isAuthenticated(
  request: AuthenticatedRequest,
  _reply: FastifyReply,
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw new HttpError(401, 'Authentication required');
    }

    const payload = verifyToken(token);
    request.user = {
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(401, 'Invalid or expired token');
  }
}
