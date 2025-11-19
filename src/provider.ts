import type { ProviderV3 } from '@ai-sdk/provider';
import type {
  OpenRouterChatModelId,
  OpenRouterChatSettings,
} from './types/openrouter-chat-settings';
import type {
  OpenRouterCompletionModelId,
  OpenRouterCompletionSettings,
} from './types/openrouter-completion-settings';

import { loadApiKey, withoutTrailingSlash } from '@ai-sdk/provider-utils';
import {
  OpenRouterChatLanguageModel,
  OpenRouterChatLanguageModelV3,
} from './chat';
import {
  OpenRouterCompletionLanguageModel,
  OpenRouterCompletionLanguageModelV3,
} from './completion';
import { withUserAgentSuffix } from './utils/with-user-agent-suffix';
import { VERSION } from './version';

export type { OpenRouterCompletionSettings };

export interface OpenRouterProvider extends ProviderV3 {
  (
    modelId: OpenRouterChatModelId,
    settings?: OpenRouterCompletionSettings,
  ): OpenRouterCompletionLanguageModelV3;
  (
    modelId: OpenRouterChatModelId,
    settings?: OpenRouterChatSettings,
  ): OpenRouterChatLanguageModelV3;

  languageModel(
    modelId: OpenRouterChatModelId,
    settings?: OpenRouterCompletionSettings,
  ): OpenRouterCompletionLanguageModelV3;
  languageModel(
    modelId: OpenRouterChatModelId,
    settings?: OpenRouterChatSettings,
  ): OpenRouterChatLanguageModelV3;

  /**
Creates an OpenRouter chat model for text generation.
   */
  chat(
    modelId: OpenRouterChatModelId,
    settings?: OpenRouterChatSettings,
  ): OpenRouterChatLanguageModelV3;

  /**
Creates an OpenRouter completion model for text generation.
   */
  completion(
    modelId: OpenRouterCompletionModelId,
    settings?: OpenRouterCompletionSettings,
  ): OpenRouterCompletionLanguageModelV3;
}

export interface OpenRouterProviderSettings {
  /**
Base URL for the OpenRouter API calls.
     */
  baseURL?: string;

  /**
@deprecated Use `baseURL` instead.
     */
  baseUrl?: string;

  /**
API key for authenticating requests.
     */
  apiKey?: string;

  /**
Custom headers to include in the requests.
     */
  headers?: Record<string, string>;

  /**
OpenRouter compatibility mode. Should be set to `strict` when using the OpenRouter API,
and `compatible` when using 3rd party providers. In `compatible` mode, newer
information such as streamOptions are not being sent. Defaults to 'compatible'.
   */
  compatibility?: 'strict' | 'compatible';

  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
    */
  fetch?: typeof fetch;

  /**
A JSON object to send as the request body to access OpenRouter features & upstream provider features.
  */
  extraBody?: Record<string, unknown>;
}

/**
Create an OpenRouter provider instance.
 */
export function createOpenRouter(
  options: OpenRouterProviderSettings = {},
): OpenRouterProvider {
  const baseURL =
    withoutTrailingSlash(options.baseURL ?? options.baseUrl) ??
    'https://openrouter.ai/api/v1';

  // we default to compatible, because strict breaks providers like Groq:
  const compatibility = options.compatibility ?? 'compatible';

  const getHeaders = () =>
    withUserAgentSuffix(
      {
        Authorization: `Bearer ${loadApiKey({
          apiKey: options.apiKey,
          environmentVariableName: 'OPENROUTER_API_KEY',
          description: 'OpenRouter',
        })}`,
        ...options.headers,
      },
      `ai-sdk/openrouter/${VERSION}`,
    );

  const createChatModelV3 = (
    modelId: OpenRouterChatModelId,
    settings: OpenRouterChatSettings = {},
  ) =>
    new OpenRouterChatLanguageModelV3(modelId, settings, {
      provider: 'openrouter.chat',
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      compatibility,
      fetch: options.fetch,
      extraBody: options.extraBody,
    });

  const createCompletionModelV3 = (
    modelId: OpenRouterCompletionModelId,
    settings: OpenRouterCompletionSettings = {},
  ) =>
    new OpenRouterCompletionLanguageModelV3(modelId, settings, {
      provider: 'openrouter.completion',
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      compatibility,
      fetch: options.fetch,
      extraBody: options.extraBody,
    });

  const createLanguageModelV3 = (
    modelId: OpenRouterChatModelId | OpenRouterCompletionModelId,
    settings?: OpenRouterChatSettings | OpenRouterCompletionSettings,
  ) => {
    if (new.target) {
      throw new Error(
        'The OpenRouter model function cannot be called with the new keyword.',
      );
    }

    if (modelId === 'openai/gpt-3.5-turbo-instruct') {
      return createCompletionModelV3(
        modelId,
        settings as OpenRouterCompletionSettings,
      );
    }

    return createChatModelV3(modelId, settings as OpenRouterChatSettings);
  };

  const provider = (
    modelId: OpenRouterChatModelId | OpenRouterCompletionModelId,
    settings?: OpenRouterChatSettings | OpenRouterCompletionSettings,
  ) => createLanguageModelV3(modelId, settings);

  // Support both V2 and V3 by providing both sets of methods
  provider.specificationVersion = 'v3' as const;
  provider.languageModel = createLanguageModelV3 as any;
  provider.chat = createChatModelV3 as any;
  provider.completion = createCompletionModelV3 as any;
  provider.textEmbeddingModel = ((_modelId: string) => {
    throw new Error('Text embedding models are not supported by OpenRouter');
  }) as any;
  provider.imageModel = ((_modelId: string) => {
    throw new Error('Image models are not yet supported by OpenRouter');
  }) as any;

  return provider as OpenRouterProvider;
}

/**
Default OpenRouter provider instance. It uses 'strict' compatibility mode.
 */
export const openrouter = createOpenRouter({
  compatibility: 'strict', // strict for OpenRouter API
});
