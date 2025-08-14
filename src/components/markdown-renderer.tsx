import React from 'react';

type MarkdownRendererProps = {
  content: string;
};

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const renderLine = (line: string) => {
    // Bold: **text**
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return line;
  };
  
  const paragraphs = content.split('\n');

  return (
    <div className="prose prose-sm max-w-none text-inherit leading-relaxed">
      {paragraphs.map((paragraph, i) => {
          // Simple list detection
          if (paragraph.match(/^(\s*(\*|-)\s+)/)) {
              return <ul key={i} className="list-disc pl-5 my-1"><li dangerouslySetInnerHTML={{ __html: renderLine(paragraph.replace(/^(\s*(\*|-)\s+)/, '')) }}/></ul>
          }
          return <p key={i} dangerouslySetInnerHTML={{ __html: renderLine(paragraph) || '&nbsp;' }} />;
      })}
    </div>
  );
};
