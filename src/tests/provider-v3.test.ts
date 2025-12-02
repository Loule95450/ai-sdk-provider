import { describe, expect, it } from 'vitest';
import {
  createOpenRouter,
  OpenRouterChatLanguageModelV3,
  OpenRouterCompletionLanguageModelV3,
} from '../provider';

describe('Provider V3 Support', () => {
  it('should create a V3 chat model', () => {
    const provider = createOpenRouter({
      apiKey: 'test-api-key',
    });

    const model = provider.chat('openai/gpt-4o');

    expect(model).toBeInstanceOf(OpenRouterChatLanguageModelV3);
    expect(model.specificationVersion).toBe('v3');
    expect(model.provider).toBe('openrouter');
    expect(model.modelId).toBe('openai/gpt-4o');
  });

  it('should create a V3 completion model', () => {
    const provider = createOpenRouter({
      apiKey: 'test-api-key',
    });

    const model = provider.completion('openai/gpt-3.5-turbo-instruct');

    expect(model).toBeInstanceOf(OpenRouterCompletionLanguageModelV3);
    expect(model.specificationVersion).toBe('v3');
    expect(model.provider).toBe('openrouter');
    expect(model.modelId).toBe('openai/gpt-3.5-turbo-instruct');
  });

  it('should create a V3 model via languageModel method', () => {
    const provider = createOpenRouter({
      apiKey: 'test-api-key',
    });

    const chatModel = provider.languageModel('openai/gpt-4o');
    expect(chatModel).toBeInstanceOf(OpenRouterChatLanguageModelV3);
    expect(chatModel.specificationVersion).toBe('v3');

    const completionModel = provider.languageModel(
      'openai/gpt-3.5-turbo-instruct',
    );
    expect(completionModel).toBeInstanceOf(OpenRouterCompletionLanguageModelV3);
    expect(completionModel.specificationVersion).toBe('v3');
  });

  it('should create a V3 model via direct provider call', () => {
    const provider = createOpenRouter({
      apiKey: 'test-api-key',
    });

    const model = provider('openai/gpt-4o');

    expect(model).toBeInstanceOf(OpenRouterChatLanguageModelV3);
    expect(model.specificationVersion).toBe('v3');
  });

  it('should have specificationVersion property on provider', () => {
    const provider = createOpenRouter({
      apiKey: 'test-api-key',
    });

    expect(provider.specificationVersion).toBe('v3');
  });

  it('should support custom settings for V3 models', () => {
    const provider = createOpenRouter({
      apiKey: 'test-api-key',
      baseURL: 'https://custom.openrouter.ai/api/v1',
    });

    const model = provider.chat('openai/gpt-4o', {
      logitBias: { 123: -1 },
      user: 'test-user',
    });

    expect(model).toBeInstanceOf(OpenRouterChatLanguageModelV3);
    expect(model.settings.logitBias).toEqual({ 123: -1 });
    expect(model.settings.user).toBe('test-user');
  });

  it('should expose both V2 and V3 models for explicit use', () => {
    expect(OpenRouterChatLanguageModelV3).toBeDefined();
    expect(OpenRouterCompletionLanguageModelV3).toBeDefined();
  });
});
