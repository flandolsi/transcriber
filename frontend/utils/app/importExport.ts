import { Conversation } from '@/types/chat';
import { ExportFormatV1, LatestExportFormat, SupportedExportFormats,} from '@/types/export';
import { FolderInterface } from '@/types/folder';


export function isExportFormatV1(obj: any): obj is ExportFormatV1 {
  return obj.version === 1;
}

export const isLatestExportFormat = isExportFormatV1;

export function cleanData(data: SupportedExportFormats): LatestExportFormat {

  if (isExportFormatV1(data)) {
    return data;
  }

  throw new Error('Unsupported data format');
}

function currentDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}-${day}`;
}

export const exportData = () => {
  let history = localStorage.getItem('conversationHistory');
  let folders = localStorage.getItem('folders');

  if (history) {
    history = JSON.parse(history);
  }

  if (folders) {
    folders = JSON.parse(folders);
  }



  const data = {
    version: 1,
    history: history || [],
    folders: folders || [],
  } as LatestExportFormat;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `transcriptions_${currentDate()}.json`;
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (
  data: SupportedExportFormats,
): LatestExportFormat => {
  const { history, folders } = cleanData(data);

  const oldConversations = localStorage.getItem('conversationHistory');
  const oldConversationsParsed = oldConversations
    ? JSON.parse(oldConversations)
    : [];

  const newHistory: Conversation[] = [
    ...oldConversationsParsed,
    ...history,
  ].filter(
    (conversation, index, self) =>
      index === self.findIndex((c) => c.id === conversation.id),
  );
  localStorage.setItem('conversationHistory', JSON.stringify(newHistory));
  if (newHistory.length > 0) {
    localStorage.setItem(
      'selectedConversation',
      JSON.stringify(newHistory[newHistory.length - 1]),
    );
  } else {
    localStorage.removeItem('selectedConversation');
  }

  const oldFolders = localStorage.getItem('folders');
  const oldFoldersParsed = oldFolders ? JSON.parse(oldFolders) : [];
  const newFolders: FolderInterface[] = [
    ...oldFoldersParsed,
    ...folders,
  ].filter(
    (folder, index, self) =>
      index === self.findIndex((f) => f.id === folder.id),
  );
  localStorage.setItem('folders', JSON.stringify(newFolders));

  const oldPrompts = localStorage.getItem('prompts');
  const oldPromptsParsed = oldPrompts ? JSON.parse(oldPrompts) : [];

  return {
    version: 1,
    history: newHistory,
    folders: newFolders,
  };
};
