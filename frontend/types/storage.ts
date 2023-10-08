import { Conversation } from './chat';
import { FolderInterface } from './folder';


// keep track of local storage schema
export interface LocalStorage {
  apiKey: string;
  conversationHistory: Conversation[];
  selectedConversation: Conversation;
  theme: 'light' | 'dark';
  folders: FolderInterface[];
  showChatbar: boolean;
}
