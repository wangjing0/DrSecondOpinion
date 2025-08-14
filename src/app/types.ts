export interface Attachment {
  name: string;
  type: string;
  size: number;
  data: string; // base64 data URI
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  attachments?: Attachment[];
}
