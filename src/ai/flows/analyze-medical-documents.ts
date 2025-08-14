// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview AI flow for analyzing medical documents and answering user questions.
 *
 * - analyzeMedicalDocuments - A function that handles the analysis of medical documents and answers user questions.
 * - AnalyzeMedicalDocumentsInput - The input type for the analyzeMedicalDocuments function.
 * - AnalyzeMedicalDocumentsOutput - The return type for the analyzeMedicalDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMedicalDocumentsInputSchema = z.object({
  documents: z.array(
    z.string().describe(
      "Medical documents and images, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    )
  ).describe('Array of medical documents and images to analyze.'),
  question: z.string().describe('The user question about the medical documents.'),
  chatHistory: z.string().optional().describe('The previous conversation history as a string or summary.'),
});
export type AnalyzeMedicalDocumentsInput = z.infer<typeof AnalyzeMedicalDocumentsInputSchema>;

const AnalyzeMedicalDocumentsOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question based on the analyzed documents.'),
});
export type AnalyzeMedicalDocumentsOutput = z.infer<typeof AnalyzeMedicalDocumentsOutputSchema>;

export async function analyzeMedicalDocuments(input: AnalyzeMedicalDocumentsInput): Promise<AnalyzeMedicalDocumentsOutput> {
  return analyzeMedicalDocumentsFlow(input);
}

const analyzeMedicalDocumentsPrompt = ai.definePrompt({
  name: 'analyzeMedicalDocumentsPrompt',
  input: {schema: AnalyzeMedicalDocumentsInputSchema},
  output: {schema: AnalyzeMedicalDocumentsOutputSchema},
  prompt: `You are an experienced doctor. Analyze the following medical documents and images to answer the user's question directly. Provide a clear and concise answer in layman's terms. If there are any special medical terms, please refer to the full English/Chinese terminology.
Remember to ALWAYS show compassion, and sympathy towards users.
Adopt the language every time the question is using, preferably English or Chinese.

Use the chat history for context.

Chat History:
{{#if chatHistory}}
{{{chatHistory}}}
{{else}}
This is the beginning of the conversation.
{{/if}}

Medical Documents:
{{#each documents}}
  {{{media url=this}}}
{{/each}}

User Question: {{{question}}}

Do not repeat the question or provide an elaborate introduction. Get straight to the point.

Disclaimer: This AI advice is not a substitute for professional medical advice.
`,
});

const analyzeMedicalDocumentsFlow = ai.defineFlow(
  {
    name: 'analyzeMedicalDocumentsFlow',
    inputSchema: AnalyzeMedicalDocumentsInputSchema,
    outputSchema: AnalyzeMedicalDocumentsOutputSchema,
  },
  async input => {
    const {output} = await analyzeMedicalDocumentsPrompt(input);
    return output!;
  }
);
