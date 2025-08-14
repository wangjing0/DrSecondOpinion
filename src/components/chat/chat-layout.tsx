
'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Message, Attachment } from '@/app/types';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-message';
import { submitQuery } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: "欢迎来到AI医生。我在这里为您提供有关医疗问题和文件的AI支持分析。今天我能为您做些什么？",
  },
];

const examplePrompts = [
  '失眠怎么办？',
  '给我制定一个生酮饮食计划',
  '帮我看看CT片子',
  '中风有什么症状',
];


export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNewSession = () => {
    setMessages(initialMessages);
  };

  const handleSendMessage = async (text: string, files: File[] = []) => {
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

    const userMessageContent = text;
    const currentMessages = [...messages];

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
      const userMessage: Message = { id: Date.now().toString(), role: 'user', content: userMessageContent, attachments };
      setMessages(prev => [...prev, userMessage]);

      const formData = new FormData();
      formData.append('question', userMessageContent);
      attachments.forEach(attachment => {
        formData.append('documents', attachment.data);
      });
      formData.append('history', JSON.stringify(currentMessages));


      const result = await submitQuery(formData);

      if (result.error) {
        toast({
          title: 'An error occurred',
          description: result.error,
          variant: 'destructive',
        });
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: "I'm sorry, I couldn't process that. " + result.error }]);
      } else {
        const aiMessage: Message = { id: Date.now().toString(), role: 'ai', content: result.answer || '' };
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
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Icons.Stethoscope className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-2xl font-bold font-headline">Dr. Second Opinion</h1>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleNewSession} disabled={isLoading}>
                <Icons.Eraser className="w-5 h-5" />
                <span className="sr-only">New Session</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New Session</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatMessages messages={messages} isLoading={isLoading} />
        {messages.length === 1 && !isLoading && (
            <div className="p-4 sm:p-6 mt-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {examplePrompts.map((prompt, index) => (
                    <Card 
                        key={index}
                        className="p-4 hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => handleSendMessage(prompt)}
                    >
                        <p className="font-medium text-sm text-center">{prompt}</p>
                    </Card>
                    ))}
                </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t bg-background/80">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <p className="text-xs text-muted-foreground text-center mt-2 px-2">
          AI advice is not a substitute for medical consultation. Always consult with qualified professionals.
        </p>
      </div>
    </Card>
  );
}
