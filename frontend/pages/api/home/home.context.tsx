import { Dispatch, createContext } from 'react';
import { ActionType } from '@/hooks/useCreateReducer';
import { Conversation } from '@/types/chat';
import { FolderType } from '@/types/folder';

import { KeyValuePair } from '@/types/data';

import { HomeInitialState } from './home.state';

export interface HomeContextProps {
  state: HomeInitialState;
  dispatch: Dispatch<ActionType<HomeInitialState>>;
  handleNewConversation: () => void;
  handleCreateFolder: (name: string, type: FolderType) => void;
  handleDeleteFolder: (folderId: string) => void;
  handleUpdateFolder: (folderId: string, name: string) => void;
  handleSelectConversation: (conversation: Conversation) => void;
  handleUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair,
  ) => void;
}

const HomeContext = createContext<HomeContextProps>(undefined!);

export default HomeContext;
