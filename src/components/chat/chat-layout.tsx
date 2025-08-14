
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;
}


const initialMessages: Message[] = [
  {
    id: '1',
    role: 'ai',
    content: "欢迎来到医见。我在这里为您提供有关医疗问题和文件的AI支持分析。请问吧!",
  },
];

const examplePrompts = [
  '失眠怎么办？',
  '给我制定一个生酮饮食计划',
  '帮我看看CT片子',
  '中风有什么症状',
  'What is mRND vaccine?',
  'Calculate the body mass index (BMI)',
];

const models = [
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash (Fastest)" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Good)" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro (Best)" },
]


export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
  const { toast } = useToast();

  const handleNewSession = () => {
    setMessages(initialMessages);
  };

  const convertPdfToImages = async (file: File): Promise<Attachment[]> => {
    const images: Attachment[] = [];
    const fileBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(fileBuffer).promise;
    const numPages = pdf.numPages;
  
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      if (context) {
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        images.push({
          name: `${file.name}-page-${i}.jpg`,
          type: 'image/jpeg',
          size: 0, // Size is not easily available here
          data: imageDataUrl,
        });
      }
    }
    return images;
  };


  const handleSendMessage = async (text: string, files: File[] = []) => {
    if (isLoading) return;
    if (!text.trim() && files.length === 0) {
      toast({
        title: 'Input required',
        description: 'Please enter a question or upload a document.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Keep a snapshot of the history before the new message
    const historyForBackend = [...messages];

    try {
        const attachmentPromises: Promise<Attachment | Attachment[]>[] = files.map(file => {
            if (file.type === 'application/pdf') {
                return convertPdfToImages(file);
            } else {
                return new Promise<Attachment>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve({ name: file.name, type: file.type, size: file.size, data: e.target?.result as string });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }
        });
        const processedAttachments = (await Promise.all(attachmentPromises)).flat();

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            attachments: processedAttachments.map(({ data, ...rest }) => rest), // Don't store full data URI in history
        };

        setMessages(prev => [...prev, userMessage]);

        const formData = new FormData();
        formData.append('question', text);
        processedAttachments.forEach(attachment => {
            formData.append('documents', attachment.data);
        });
        formData.append('history', JSON.stringify(historyForBackend));
        formData.append('model', selectedModel);

        const result = await submitQuery(formData);

        if (result.error) {
            const errorMessage: Message = { id: (Date.now() + 2).toString(), role: 'ai', content: "I'm sorry, I couldn't process that. " + result.error };
            setMessages(prev => [...prev, errorMessage]);
            toast({
                title: 'An error occurred',
                description: result.error,
                variant: 'destructive',
            });
        } else {
            const aiMessage: Message = { id: (Date.now() + 2).toString(), role: 'ai', content: result.answer || '' };
            setMessages(prev => [...prev, aiMessage]);
        }

    } catch (error) {
        console.error("Error processing files:", error);
        const errorMessageContent = 'An unexpected error occurred while processing files. Please try again.';
        const errorMessage: Message = { id: (Date.now() + 2).toString(), role: 'ai', content: errorMessageContent };
        setMessages(prev => [...prev, errorMessage]);
        toast({
            title: 'Error',
            description: errorMessageContent,
            variant: 'destructive',
        });
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
        <div className="flex items-center gap-2">
            <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isLoading}>
                <SelectTrigger className="w-[240px] text-xs">
                    <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                    {models.map(model => (
                        <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
        </div>
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
