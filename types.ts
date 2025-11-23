export enum Role {
  COPYWRITER = 'COPYWRITER',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  DESIGNER = 'DESIGNER',
  GROWTH = 'GROWTH',
}

export interface Professional {
  id: Role;
  name: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  systemInstruction: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}