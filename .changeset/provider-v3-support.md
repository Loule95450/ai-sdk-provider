---
"@openrouter/ai-sdk-provider": minor
---

Add support for AI SDK v6 beta Provider V3 specification

This release adds support for the new Provider V3 specification introduced in AI SDK v6 beta, while maintaining backward compatibility with AI SDK v5.

**New Features:**
- Provider V3 implementation with `OpenRouterChatLanguageModelV3` and `OpenRouterCompletionLanguageModelV3`
- Support for both AI SDK v5 (Provider V2) and AI SDK v6 beta (Provider V3)
- The default provider now returns V3 models to prepare for future migration
- Both V2 and V3 models are explicitly exported for flexibility

**Breaking Changes:**
- The default `openrouter` provider and `createOpenRouter()` now return V3 models by default
- Users with AI SDK v5 should either:
  - Continue using the deprecated `OpenRouter` class (returns V2 models)
  - Explicitly use `OpenRouterChatLanguageModel` and `OpenRouterCompletionLanguageModel` classes
  - Wait for full AI SDK v6 stable release before upgrading

**Migration:**
- For AI SDK v6 beta users: No changes needed, upgrade to `ai@beta` and use as normal
- For AI SDK v5 users: Use the deprecated `OpenRouter` class or explicit V2 model classes

**Technical Details:**
- V3 models are implemented as wrappers around V2 models for code reuse
- Type conversions are handled transparently
- Peer dependencies updated to support both AI SDK versions
