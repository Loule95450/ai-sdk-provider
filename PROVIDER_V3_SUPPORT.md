# Provider V3 Support

This package now supports both AI SDK v5 (with Provider V2) and AI SDK v6 beta (with Provider V3).

## What's New

- Added support for the new Provider V3 specification introduced in AI SDK v6 beta
- The default provider now returns V3 models to prepare for future migration
- Both V2 and V3 models are exported and can be used explicitly

## Usage

### With AI SDK v6 Beta (Provider V3)

The default behavior now uses Provider V3:

```typescript
import { openrouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai'; // AI SDK v6 beta

const { text } = await generateText({
  model: openrouter('openai/gpt-4o'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### Explicit V3 Model Usage

You can also explicitly use V3 models:

```typescript
import { 
  createOpenRouter,
  OpenRouterChatLanguageModelV3 
} from '@openrouter/ai-sdk-provider';

const provider = createOpenRouter({ apiKey: 'your-api-key' });
const model = provider.chat('openai/gpt-4o'); // Returns V3 model
```

### Backward Compatibility with AI SDK v5 (Provider V2)

If you need to use V2 models explicitly (e.g., with AI SDK v5):

```typescript
import { 
  OpenRouterChatLanguageModel,
  OpenRouterCompletionLanguageModel 
} from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai'; // AI SDK v5

// Create V2 models directly
const model = new OpenRouterChatLanguageModel(
  'openai/gpt-4o',
  {},
  {
    provider: 'openrouter.chat',
    url: ({ path }) => `https://openrouter.ai/api/v1${path}`,
    headers: () => ({
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    }),
    compatibility: 'strict',
  }
);

const { text } = await generateText({
  model,
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

Or use the deprecated `OpenRouter` class:

```typescript
import { OpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai'; // AI SDK v5

const openrouter = new OpenRouter({ apiKey: 'your-api-key' });
const model = openrouter.chat('openai/gpt-4o'); // Returns V2 model

const { text } = await generateText({
  model,
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Installation

For AI SDK v6 beta:

```bash
npm install ai@beta @openrouter/ai-sdk-provider
```

For AI SDK v5:

```bash
npm install ai@^5.0.0 @openrouter/ai-sdk-provider
```

## Technical Details

### Provider V3 Features

Provider V3 is designed to support new AI SDK v6 features including:

- Agent abstraction
- Tool execution approval
- Structured output (stable)
- Reranking support
- Image editing support (coming soon)

### Implementation

The V3 models are implemented as wrappers around the V2 models, ensuring:

- Full backward compatibility
- Minimal code duplication
- Type safety for both versions
- Easy migration path

The V3 models delegate to the V2 implementation internally, with type conversions handled transparently.

## Migration Guide

### From AI SDK v5 to v6 Beta

1. Update your dependencies:
   ```bash
   npm install ai@beta @ai-sdk/provider@beta
   ```

2. Your existing code should continue to work with minimal changes:
   ```typescript
   import { openrouter } from '@openrouter/ai-sdk-provider';
   import { generateText } from 'ai';

   // No changes needed - the provider now returns V3 models by default
   const { text } = await generateText({
     model: openrouter('openai/gpt-4o'),
     prompt: 'Hello!',
   });
   ```

3. If you encounter type issues, ensure you're using the latest version of both `ai` and `@openrouter/ai-sdk-provider`.

## Troubleshooting

### Type Conflicts

If you see type conflicts between V2 and V3 models, ensure:

1. You're using compatible versions:
   - AI SDK v5: `@ai-sdk/provider@^2.0.0`
   - AI SDK v6 beta: `@ai-sdk/provider@^3.0.0-beta`

2. Your package manager has resolved dependencies correctly:
   ```bash
   npm ls @ai-sdk/provider
   # or
   pnpm list @ai-sdk/provider
   ```

3. If using both v5 and v6 in the same project (not recommended), use explicit model classes instead of the provider instance.

## Future Plans

- Full AI SDK v6 stable support when released
- Deprecation of V2 models after AI SDK v6 becomes stable
- Additional features as they become available in the AI SDK
