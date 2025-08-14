'use server';

import { analyzeMedicalDocuments } from '@/ai/flows/analyze-medical-documents';
import { summarizeChatHistory } from '@/ai/flows/summarize-chat-history';
import { z } from 'zod';
import type { Message } from './types';

const formSchema = z.object({
  question: z.string(),
  documents: z.array(z.string()),
  history: z.string().optional(),
});

// Arbitrary token limit for summarization
const HISTORY_TOKEN_LIMIT = 4000;

export async function submitQuery(formData: FormData) {
  const rawData = {
    question: formData.get('question') as string,
    documents: formData.getAll('documents') as string[],
    history: formData.get('history') as string,
  };

  const parsed = formSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: 'Invalid input.' };
  }
  
  const { question, documents, history } = parsed.data;

  if (!question && documents.length === 0) {
    return { error: 'Please enter a question or upload a document.' };
  }
  
  let chatHistory: Message[] = [];
  let chatHistoryString: string | undefined = undefined;

  if (history) {
    try {
      chatHistory = JSON.parse(history);
      const historyText = chatHistory.map(m => `${m.role}: ${m.content}`).join('\n');
      
      // A simple heuristic to check token length. 1 char ~ 1 token.
      if (historyText.length > HISTORY_TOKEN_LIMIT) {
        const summaryResult = await summarizeChatHistory({ chatHistory: historyText });
        chatHistoryString = `Summary of previous conversation:\n${summaryResult.summary}`;
      } else {
        chatHistoryString = historyText;
      }
    } catch (e) {
      console.error("Failed to parse or process chat history", e);
      // Continue without history if it's malformed
    }
  }


  try {
    const result = await analyzeMedicalDocuments({
      question: question,
      documents: documents,
      chatHistory: chatHistoryString,
    });
    return { ...result };
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while processing your request. Please try again later.' };
  }
}
