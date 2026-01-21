import type { z } from 'zod';

/**
 * Convert Zod schema to JSON Schema for OpenAPI documentation
 * Uses Zod v4's native toJSONSchema() method
 * Preserves descriptions and adds additional metadata
 */
export function zodToOpenApiSchema(
  schema: z.ZodTypeAny,
  options?: {
    title?: string;
    description?: string;
    examples?: any[];
  },
): any {
  // Use Zod v4's native toJSONSchema method
  const jsonSchema = (schema as any).toJSONSchema();

  // Remove $schema metadata that Fastify/Swagger doesn't need
  if (jsonSchema && typeof jsonSchema === 'object' && '$schema' in jsonSchema) {
    delete jsonSchema.$schema;
  }

  // Add title if provided
  if (options?.title && typeof jsonSchema === 'object' && !Array.isArray(jsonSchema)) {
    jsonSchema.title = options.title;
  }

  // Add additional OpenAPI metadata
  if (options?.description && typeof jsonSchema === 'object' && !Array.isArray(jsonSchema)) {
    jsonSchema.description = options.description;
  }

  if (options?.examples && typeof jsonSchema === 'object' && !Array.isArray(jsonSchema)) {
    jsonSchema.examples = options.examples;
  }

  return jsonSchema;
}

/**
 * Create a Fastify-compatible schema object from Zod schemas
 */
export interface FastifyZodSchema {
  body?: z.ZodTypeAny;
  querystring?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  headers?: z.ZodTypeAny;
  response?: {
    [statusCode: number]: z.ZodTypeAny;
  };
}

/**
 * Convert Zod schemas to JSON Schema format for Fastify
 * This maintains compatibility with existing OpenAPI generation
 */
export function createFastifySchema(zodSchemas: FastifyZodSchema): any {
  const schema: any = {};

  if (zodSchemas.body) {
    schema.body = zodToOpenApiSchema(zodSchemas.body);
  }

  if (zodSchemas.querystring) {
    schema.querystring = zodToOpenApiSchema(zodSchemas.querystring);
  }

  if (zodSchemas.params) {
    schema.params = zodToOpenApiSchema(zodSchemas.params);
  }

  if (zodSchemas.headers) {
    schema.headers = zodToOpenApiSchema(zodSchemas.headers);
  }

  if (zodSchemas.response) {
    schema.response = {};
    for (const [statusCode, zodSchema] of Object.entries(zodSchemas.response)) {
      schema.response[statusCode] = zodToOpenApiSchema(zodSchema);
    }
  }

  return schema;
}

/**
 * Helper to add OpenAPI tags and metadata to route schema
 */
export function withOpenApiMetadata(
  schema: any,
  metadata: {
    tags?: string[];
    summary?: string;
    description?: string;
    security?: Array<Record<string, string[]>>;
    'x-roles'?: string[];
    'x-required-permissions'?: string[];
    operationId?: string;
    deprecated?: boolean;
  },
): any {
  return {
    ...schema,
    ...metadata,
  };
}
