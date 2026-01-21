import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { HttpError } from './HttpError';
import { logger } from './logger';

export async function errorHandler(
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // Zod validation error
  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    logger.warn('Validation error', {
      path: request.url,
      method: request.method,
      errors,
    });

    await reply.code(400).send({
      success: false,
      message: 'Validation error',
      errors,
    });
    return;
  }

  // HttpError (custom error)
  if (error instanceof HttpError) {
    logger.error(`HTTP Error ${error.statusCode}`, error, {
      path: request.url,
      method: request.method,
    });

    await reply.code(error.statusCode).send({
      success: false,
      message: error.message,
    });
    return;
  }

  // Fastify validation error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((error as any).validation) {
    logger.warn('Fastify validation error', {
      path: request.url,
      method: request.method,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (error as any).validation,
    });

    await reply.code(400).send({
      success: false,
      message: 'Validation error',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errors: (error as any).validation,
    });
    return;
  }

  // Prisma errors

  if (
    (error as any).code &&
    typeof (error as any).code === 'string' &&
    (error as any).code.startsWith('P')
  ) {
    const prismaError = error as any;
    logger.error('Prisma error', error, {
      path: request.url,
      method: request.method,
      code: prismaError.code,
    });

    // Provide more helpful error messages for common Prisma errors
    let message = 'Database error';
    if (prismaError.code === 'P2002') {
      message = 'A record with this value already exists';
    } else if (prismaError.code === 'P2025') {
      message = 'Record not found';
    } else if (prismaError.code === 'P2014') {
      message = 'Invalid relation or constraint violation';
    } else if (prismaError.message) {
      // Extract a more readable message from Prisma error
      const errorMsg = prismaError.message;
      if (errorMsg.includes('column') && errorMsg.includes('does not exist')) {
        message = 'Database schema mismatch. Please run migrations: npx prisma migrate dev';
      } else if (errorMsg.includes('Unknown argument')) {
        message = 'Invalid query parameter';
      } else {
        // Take first line of error message for cleaner output
        message = errorMsg.split('\n')[0] || 'Database error';
      }
    }

    await reply.code(400).send({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && {
        details: prismaError.message,
      }),
    });
    return;
  }

  // Generic Error
  if (error instanceof Error) {
    logger.error('Unhandled error', error, {
      path: request.url,
      method: request.method,
    });

    await reply.code(500).send({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
    return;
  }

  // Unknown error
  logger.error('Unknown error', error, {
    path: request.url,
    method: request.method,
  });

  await reply.code(500).send({
    success: false,
    message: 'Internal server error',
  });
}
