'use server';

import { analyzeMedicalDocuments } from '@/ai/flows/analyze-medical-documents';
import { z } from 'zod';

const formSchema = z.object({
  question: z.string(),
  documents: z.array(z.string()),
});

export async function submitQuery(formData: FormData) {
  const data = {
    question: formData.get('question') as string,
    documents: formData.getAll('documents') as string[],
  };

  const parsed = formSchema.safeParse(data);
  if (!parsed.success) {
    // This should not happen with client-side validation, but as a safeguard.
    return { error: 'Invalid input.' };
  }

  if (!parsed.data.question && parsed.data.documents.length === 0) {
    return { error: 'Please enter a question or upload a document.' };
  }

  try {
    const result = await analyzeMedicalDocuments({
      question: parsed.data.question,
      documents: parsed.data.documents,
    });
    return { ...result };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while processing your request. Please try again later.' };
  }
}
