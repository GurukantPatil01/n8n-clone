import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

/**
 * AI PROVIDER INTEGRATION
 * 
 * Learning: Integrate multiple AI providers with a unified interface
 * - OpenAI: GPT-4, GPT-3.5-turbo
 * - Anthropic: Claude 3 (Opus, Sonnet, Haiku)
 * 
 * Use cases:
 * - Text generation
 * - Data extraction
 * - Summarization
 * - Classification
 * - Translation
 */

// Initialize clients (will be undefined if API keys not provided)
export const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

export type AIProvider = 'openai' | 'anthropic';

export interface AIGenerateOptions {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
}

/**
 * Generate text using AI
 */
export async function generateText(
    provider: AIProvider,
    prompt: string,
    options: AIGenerateOptions = {}
): Promise<string> {
    const {
        model,
        maxTokens = 1000,
        temperature = 0.7,
        systemPrompt,
    } = options;

    try {
        if (provider === 'openai') {
            if (!openai) {
                throw new Error('OpenAI API key not configured');
            }

            const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

            if (systemPrompt) {
                messages.push({ role: 'system', content: systemPrompt });
            }

            messages.push({ role: 'user', content: prompt });

            const response = await openai.chat.completions.create({
                model: model || 'gpt-4',
                messages,
                max_tokens: maxTokens,
                temperature,
            });

            return response.choices[0].message.content || '';
        } else if (provider === 'anthropic') {
            if (!anthropic) {
                throw new Error('Anthropic API key not configured');
            }

            const response = await anthropic.messages.create({
                model: model || 'claude-3-sonnet-20240229',
                max_tokens: maxTokens,
                temperature,
                system: systemPrompt,
                messages: [{ role: 'user', content: prompt }],
            });

            const textContent = response.content.find((c) => c.type === 'text');
            return textContent && 'text' in textContent ? textContent.text : '';
        } else {
            throw new Error(`Unknown AI provider: ${provider}`);
        }
    } catch (error) {
        console.error(`AI generation error (${provider}):`, error);
        throw error;
    }
}

/**
 * Extract structured data from text using AI
 */
export async function extractData(
    provider: AIProvider,
    text: string,
    schema: Record<string, string>
): Promise<Record<string, any>> {
    const schemaDescription = Object.entries(schema)
        .map(([key, description]) => `- ${key}: ${description}`)
        .join('\n');

    const prompt = `Extract the following information from the text and return it as JSON:

${schemaDescription}

Text:
${text}

Return only valid JSON, no other text.`;

    const response = await generateText(provider, prompt, {
        temperature: 0.3, // Lower temperature for more consistent extraction
    });

    try {
        return JSON.parse(response);
    } catch (error) {
        console.error('Failed to parse AI response as JSON:', response);
        throw new Error('AI did not return valid JSON');
    }
}

/**
 * Summarize text using AI
 */
export async function summarizeText(
    provider: AIProvider,
    text: string,
    maxLength: number = 200
): Promise<string> {
    const prompt = `Summarize the following text in ${maxLength} words or less:

${text}`;

    return await generateText(provider, prompt, {
        maxTokens: Math.ceil(maxLength * 1.5), // Rough token estimate
        temperature: 0.5,
    });
}

/**
 * Check if AI providers are configured
 */
export function getAvailableProviders(): AIProvider[] {
    const providers: AIProvider[] = [];
    if (openai) providers.push('openai');
    if (anthropic) providers.push('anthropic');
    return providers;
}

/**
 * LEARNING NOTES:
 * 
 * AI Provider Comparison:
 * 
 * OpenAI (GPT-4):
 * - Pros: Very capable, fast, good at following instructions
 * - Cons: Can be expensive, rate limits
 * - Best for: General text generation, complex reasoning
 * 
 * Anthropic (Claude 3):
 * - Pros: Long context window, good at analysis, safer outputs
 * - Cons: Slightly slower, newer
 * - Best for: Document analysis, long-form content
 * 
 * Temperature:
 * - 0.0-0.3: Deterministic, factual (good for extraction)
 * - 0.4-0.7: Balanced (good for general use)
 * - 0.8-1.0: Creative, varied (good for brainstorming)
 * 
 * Max Tokens:
 * - Controls response length
 * - 1 token ≈ 0.75 words (English)
 * - Set based on expected output length
 * 
 * System Prompt:
 * - Sets AI behavior and context
 * - Use for role-playing or constraints
 * - Example: "You are a helpful assistant that always responds in JSON"
 */
