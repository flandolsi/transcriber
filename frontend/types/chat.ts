export interface Segment {
  startTime: string;
  endTime: string;
  text: string;
}


export interface Conversation {
  id: string;
  name: string;
  language: string;
  messages: string;       // Array fitting for translations
  segments: Segment[];
  folderId: string | null;
}
