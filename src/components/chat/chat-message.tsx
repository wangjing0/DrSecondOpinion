'use client';

import React, { useRef, useEffect } from 'react';
import type { Message } from '@/app/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  return (
    <ScrollArea className="h-full" ref={scrollAreaRef}>
      <div className="p-4 sm:p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn('flex items-start gap-4', {
              'justify-end': message.role === 'user',
            })}
          >
            {message.role === 'ai' && (
              <Avatar className="w-10 h-10 border-2 border-primary/50">
                <AvatarFallback>
                  <Icons.Bot className="w-5 h-5 text-primary" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-md lg:max-w-2xl rounded-xl p-4 shadow-md',
                {
                  'bg-primary text-primary-foreground': message.role === 'user',
                  'bg-card': message.role === 'ai',
                }
              )}
            >
              {message.attachments && message.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {message.attachments.map((file, i) => (
                    <Badge variant="secondary" key={i}>
                      <Icons.Paperclip className="w-3 h-3 mr-1.5" />
                      {file.name}
                    </Badge>
                  ))}
                </div>
              )}
              <MarkdownRenderer content={message.content} />
            </div>
            {message.role === 'user' && (
              <Avatar className="w-10 h-10 border-2 border-gray-300">
                <AvatarFallback>
                  <Icons.User className="w-5 h-5 text-gray-500" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10 border-2 border-primary/50">
              <AvatarFallback>
                <Icons.Bot className="w-5 h-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="max-w-md p-4 bg-card rounded-xl shadow-md flex items-center space-x-2">
                <Icons.Spinner className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Dr. AI is thinking...</span>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}
