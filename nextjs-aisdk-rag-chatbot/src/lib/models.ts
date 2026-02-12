import { anthropic } from "@ai-sdk/anthropic";
import { openai as originalOpenAI } from "@ai-sdk/openai";
import { ollama } from "@/lib/ollama/client";
import { lmStudio } from "@/lib/ollama/client";

import {
  createProviderRegistry,
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from "ai";

const customOpenAI = customProvider({
  languageModels: {
    fast: originalOpenAI("gpt-5-nano"),
    smart: originalOpenAI("gpt-5-mini"),
    reasoning: wrapLanguageModel({
      model: originalOpenAI("gpt-5-mini"),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: "high",
            },
          },
        },
      }),
    }),
  },
  fallbackProvider: originalOpenAI,
});

const customAnthropic = customProvider({
  languageModels: {
    fast: anthropic("claude-3-5-haiku-20241022"),
    smart: anthropic("claude-sonnet-4-20250514"),
  },
  fallbackProvider: anthropic,
});

const customOllama = customProvider({
  languageModels: {
    fast: ollama("gemma3:4b"),
  },
  embeddingModels: {
    fast: ollama.embeddingModel("qwen3-embedding:latest"),
  },
  fallbackProvider: ollama,
});

const customLmStudio = customProvider({
  languageModels: {
    fast: lmStudio("gemma3:4b"),
  },
  fallbackProvider: lmStudio,
});

export const registry = createProviderRegistry({
  openai: customOpenAI,
  anthropic: customAnthropic,
  ollama: customOllama,
  lmstudio: customLmStudio,
});
