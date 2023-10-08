import { Conversation } from './chat';
import { FolderInterface } from './folder';

export type SupportedExportFormats = ExportFormatV1
export type LatestExportFormat = ExportFormatV1;


interface ChatFolder {
  id: number;
  name: string;
}

export interface ExportFormatV1 {
  version: 1;
  history: Conversation[];
  folders: FolderInterface[];
}
