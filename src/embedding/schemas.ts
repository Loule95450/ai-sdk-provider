import { z } from 'zod/v4';

const openrouterEmbeddingUsageSchema = z.object({
  prompt_tokens: z.number(),
  total_tokens: z.number(),
  cost: z.number().optional(),
});

// Preprocess the embedding field to handle both arrays and objects with numeric keys
const embeddingPreprocessor = z.preprocess((val) => {
  // If it's already an array, return as-is
  if (Array.isArray(val)) {
    return val;
  }
  // If it's an object with numeric keys, convert to array
  if (typeof val === 'object' && val !== null) {
    const keys = Object.keys(val);
    // Check if all keys are numeric strings
    const allNumeric = keys.every((k) => !Number.isNaN(Number(k)));
    if (allNumeric && keys.length > 0) {
      // Sort by numeric key and extract values
      return keys
        .map((k) => ({ idx: Number(k), val: val[k as keyof typeof val] }))
        .sort((a, b) => a.idx - b.idx)
        .map((item) => item.val);
    }
  }
  // Return as-is if neither case applies (will fail validation later)
  return val;
}, z.array(z.coerce.number()));

const openrouterEmbeddingDataSchema = z.object({
  object: z.literal('embedding'),
  embedding: embeddingPreprocessor,
  index: z.number().optional(),
});

export const OpenRouterEmbeddingResponseSchema = z.object({
  id: z.string().optional(),
  object: z.literal('list'),
  data: z.array(openrouterEmbeddingDataSchema),
  model: z.string(),
  usage: openrouterEmbeddingUsageSchema.optional(),
});

export type OpenRouterEmbeddingResponse = z.infer<
  typeof OpenRouterEmbeddingResponseSchema
>;
