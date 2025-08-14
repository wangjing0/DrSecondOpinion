'use server';
/**
 * @fileOverview Implements the AI-powered follow-up questions flow to gather more context and provide accurate advice.
 *
 * - aiPoweredFollowUpQuestions - A function that initiates the follow-up question process.
 * - AiPoweredFollowUpQuestionsInput - The input type for the aiPoweredFollowUpQuestions function.
 * - AiPoweredFollowUpQuestionsOutput - The return type for the aiPoweredFollowUpQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredFollowUpQuestionsInputSchema = z.object({
  initialAssessment: z.string().describe('The initial AI assessment provided to the user.'),
  userQuestion: z.string().describe('The user provided question or input.'),
  medicalRecords: z.string().optional().describe('Medical records submitted by the user as a data URI.'),
  doctorNotes: z.string().optional().describe('Doctor notes submitted by the user as a data URI.'),
  images: z.array(z.string()).optional().describe('Images submitted by the user as data URIs.'),
});
export type AiPoweredFollowUpQuestionsInput = z.infer<typeof AiPoweredFollowUpQuestionsInputSchema>;

const AiPoweredFollowUpQuestionsOutputSchema = z.object({
  followUpQuestions: z.array(z.string()).describe('Array of follow-up questions to ask the user.'),
});
export type AiPoweredFollowUpQuestionsOutput = z.infer<typeof AiPoweredFollowUpQuestionsOutputSchema>;

export async function aiPoweredFollowUpQuestions(input: AiPoweredFollowUpQuestionsInput): Promise<AiPoweredFollowUpQuestionsOutput> {
  return aiPoweredFollowUpQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredFollowUpQuestionsPrompt',
  input: {schema: AiPoweredFollowUpQuestionsInputSchema},
  output: {schema: AiPoweredFollowUpQuestionsOutputSchema},
  prompt: `You are an experienced doctor with a compassionate and sympathetic demeanor.
  Based on the initial AI assessment and the user's input, generate a list of follow-up questions
  to gather more context and provide more accurate and personalized medical advice.
  Respond in the language the user is using.

  Initial Assessment: {{{initialAssessment}}}
  User Input: {{{userQuestion}}}
  Medical Records: {{#if medicalRecords}}{{media url=medicalRecords}}{{else}}Not provided{{/if}}
  Doctor's Notes: {{#if doctorNotes}}{{media url=doctorNotes}}{{else}}Not provided{{/if}}
  Images: {{#if images}}{{#each images}}{{media url=this}}{{/each}}{{else}}Not provided{{/if}}

  Follow-up Questions:
  `,
});

const aiPoweredFollowUpQuestionsFlow = ai.defineFlow(
  {
    name: 'aiPoweredFollowUpQuestionsFlow',
    inputSchema: AiPoweredFollowUpQuestionsInputSchema,
    outputSchema: AiPoweredFollowUpQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
