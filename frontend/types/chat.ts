export interface Conversation {
  id: string;
  name: string;
  messages: string[];       // Array fitting for translations
  folderId: string | null;
}
