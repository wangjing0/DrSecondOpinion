'use server';

/**
 * @fileOverview This file defines a Genkit flow that takes medical advice and translates it into layman's terms,
 * including definitions of medical terminology.
 *
 * - generateAdviceInLaymansTerms - A function that processes medical advice and returns a simplified explanation.
 * - GenerateAdviceInput - The input type for the generateAdviceInLaymansTerms function.
 * - GenerateAdviceOutput - The return type for the generateAdviceInLaymansTerms function.
 */

import {ai} from '@/ai/genkit';
import {google_search, z} from 'genkit';

const GenerateAdviceInputSchema = z.object({
  medicalAdvice: z
    .string()
    .describe('The medical advice to be translated into layman terms.'),
  userLanguage: z
    .string()
    .optional()
    .default('English')
    .describe('The user\u0027s preferred language for the explanation.'),
});
export type GenerateAdviceInput = z.infer<typeof GenerateAdviceInputSchema>;

const GenerateAdviceOutputSchema = z.object({
  laymanExplanation: z
    .string()
    .describe(
      'The medical advice translated into layman terms, with medical terminology defined.'
    ),
});
export type GenerateAdviceOutput = z.infer<typeof GenerateAdviceOutputSchema>;

export async function generateAdviceInLaymansTerms(
  input: GenerateAdviceInput
): Promise<GenerateAdviceOutput> {
  return generateAdviceInLaymansTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdviceInLaymansTermsPrompt',
  input: {schema: GenerateAdviceInputSchema},
  output: {schema: GenerateAdviceOutputSchema},
  prompt: `You are an experienced doctor explaining medical related information to patients. Use the provided search results to help you explain the medical advice.
Describe the following medical advice into layman's terms in {{userLanguage}}. Show compassion and sympathy towards users. Display the information clearly and concisely.

Medical Advice: {{{medicalAdvice}}}`,
});

const generateAdviceInLaymansTermsFlow = ai.defineFlow(
  {
    name: 'generateAdviceInLaymansTermsFlow',
    inputSchema: GenerateAdviceInputSchema,
    outputSchema: GenerateAdviceOutputSchema,
  },
  async input => {
    // Use google_search to find information about medical terms in the advice
    const searchResults = await google_search.search({
      q: `define medical terms in: ${input.medicalAdvice}`,
    });

    const {output} = await prompt({...input, context: searchResults});
    return output!;
  }
);
