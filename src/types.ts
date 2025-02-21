import { z } from 'zod';

export const ParameterTypeSchema = z.enum(['string', 'number', 'boolean', 'object', 'array']);
export type ParameterType = z.infer<typeof ParameterTypeSchema>;

export const APIMethodSchema = z.enum(['GET', 'POST', 'PUT', 'DELETE']);
export type APIMethod = z.infer<typeof APIMethodSchema>;

export const APIParameterSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "参数名称不能为空"),
  type: ParameterTypeSchema,
  required: z.boolean(),
  description: z.string(),
  defaultValue: z.string().optional(),
  validation: z.string().optional(),
});
export type APIParameter = z.infer<typeof APIParameterSchema>;

export const APISchema = z.object({
  id: z.string(),
  name: z.string().min(1, "API名称不能为空"),
  endpoint: z.string().min(1, "端点不能为空").startsWith("/", "端点必须以/开头"),
  method: APIMethodSchema,
  description: z.string().min(1, "描述不能为空"),
  parameters: z.array(APIParameterSchema),
  responseExample: z.string().optional(),
  version: z.string().default("1.0.0"),
  tags: z.array(z.string()).default([]),
  status: z.enum(['active', 'deprecated', 'draft']).default('active'),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});
export type API = z.infer<typeof APISchema>;