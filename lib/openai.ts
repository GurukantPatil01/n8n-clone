import OpenAI from 'openai';

/**
 * OPENAI HELPER
 * 
 * Wrapper for OpenAI API calls
 * Handles chat completions for GPT nodes
 */

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true, // Required for client-side usage
});

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatCompletionOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    messages: ChatMessage[];
}

/**
 * Generate chat completion using OpenAI
 */
export async function generateChatCompletion(options: ChatCompletionOptions): Promise<string> {
    try {
        const {
            model = 'gpt-3.5-turbo',
            temperature = 0.7,
            maxTokens = 1000,
            messages,
        } = options;

        const completion = await openai.chat.completions.create({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
        });

        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error(`OpenAI API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Simple prompt completion (convenience function)
 */
export async function simpleCompletion(
    prompt: string,
    systemPrompt = 'You are a helpful assistant.',
    model = 'gpt-3.5-turbo'
): Promise<string> {
    return generateChatCompletion({
        model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
        ],
    });
}
