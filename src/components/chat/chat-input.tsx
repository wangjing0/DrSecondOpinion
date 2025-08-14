'use client';

import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (text: string, files: File[]) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (files.length + newFiles.length > 5) {
         toast({ title: "Too many files", description: "You can upload a maximum of 5 files.", variant: "destructive" });
         return;
      }
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSendMessage(text, files);
    setText('');
    setFiles([]);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as any);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
       {files.length > 0 && (
         <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
                <Badge key={index} variant="secondary" className="pl-2 pr-1">
                    <Icons.Paperclip className="w-3 h-3 mr-1.5 flex-shrink-0"/>
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button type="button" onClick={() => handleRemoveFile(index)} className="ml-1.5 p-0.5 rounded-full hover:bg-muted-foreground/20" disabled={isLoading}>
                       <Icons.Trash className="w-3 h-3"/>
                    </button>
                </Badge>
            ))}
         </div>
       )}
      <div className="flex items-start w-full gap-2">
        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or describe your concern..."
          className="flex-1 resize-none"
          rows={1}
          disabled={isLoading}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*,application/pdf,.doc,.docx"
        />
        <Button 
          type="button" 
          variant="outline"
          size="icon" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          aria-label="Upload file"
        >
          <Icons.Paperclip className="w-5 h-5" />
        </Button>
        <Button type="submit" size="icon" disabled={isLoading} aria-label="Send message" className="bg-accent hover:bg-accent/90">
          {isLoading ? (
            <Icons.Spinner className="w-5 h-5 animate-spin" />
          ) : (
            <Icons.Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </form>
  );
}
