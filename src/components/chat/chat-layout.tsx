'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Message, Attachment } from '@/app/types';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-message';
import { submitQuery } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '../ui/card';

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: "Welcome to Dr. Second Opinion. I'm here to provide an AI-powered analysis of your medical questions and documents. How can I help you today?",
  },
];

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (text: string, files: File[]) => {
    if (isLoading) return;
    if (!text && files.length === 0) {
      toast({
        title: 'Input required',
        description: 'Please enter a question or upload a document.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const fileDataPromises = files.map(file => {
        return new Promise<Attachment>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve({ name: file.name, type: file.type, size: file.size, data: e.target?.result as string });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const attachments = await Promise.all(fileDataPromises);
      const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text, attachments };
      setMessages(prev => [...prev, userMessage]);

      const formData = new FormData();
      formData.append('question', text);
      attachments.forEach(attachment => {
        formData.append('documents', attachment.data);
      });

      const result = await submitQuery(formData);

      if (result.error) {
        toast({
          title: 'An error occurred',
          description: result.error,
          variant: 'destructive',
        });
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: "I'm sorry, I couldn't process that. " + result.error }]);
      } else {
        const aiMessage: Message = { id: Date.now().toString(), role: 'ai', content: result.answer + (result.reasoning ? `\n\n**Reasoning:**\n${result.reasoning}`: '') };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100dvh-4rem)] w-full max-w-4xl m-4 shadow-2xl rounded-2xl">
      <header className="flex items-center p-4 border-b">
        <Icons.Stethoscope className="w-8 h-8 mr-3 text-primary" />
        <h1 className="text-2xl font-bold font-headline">Dr. Second Opinion</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </div>
      <div className="p-4 border-t bg-background/80">
        <Alert className="mb-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <Icons.AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="font-semibold text-yellow-700 dark:text-yellow-300">Disclaimer</AlertTitle>
          <AlertDescription className="text-yellow-600 dark:text-yellow-400">
            This AI advice is not a substitute for professional medical consultation. Always consult with a qualified doctor.
          </AlertDescription>
        </Alert>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </Card>
  );
}
