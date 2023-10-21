import { FC } from 'react';
import { SupportedExportFormats } from '@/types/export';

import {IconEdit, IconCopy, IconClockHour3, IconFaceId } from '@tabler/icons-react';


import {
  IconArrowDown,
  IconBolt,
  IconBrandGoogle,
  IconMicrophone,
  IconMicrophoneOff,
  IconPlayerStop,
  IconRepeat,
  IconSend,
  IconUpload,
} from '@tabler/icons-react';
import {
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Message } from '@/types/chat';


import HomeContext from '@/pages/api/home/home.context';



interface Props {
  onSend: (message: Message, plugin: Plugin | null) => void;
  onEditToggle: () => void;
  onRegenerate: () => void;
  onScrollDownClick: () => void;
  stopConversationRef: MutableRefObject<boolean>;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  showScrollDownButton: boolean;
}

export const ChatInput = ({
  onSend,
  onEditToggle,
  onRegenerate,
  onScrollDownClick,
  stopConversationRef,
  textareaRef,
  showScrollDownButton,
}: Props) => {

  const {
    state: { selectedConversation, messageIsStreaming, codeInterpreterEnbaled, prompts },

    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [promptInputValue, setPromptInputValue] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPluginSelect, setShowPluginSelect] = useState(false);
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [isRecording,setIsRecording] = useState(false);
  const [isBlocked,setIsBlocked] = useState(false);
  const [blobURL, setBlobURL] = useState('');



  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;




    setContent(value);

    return;

  };


  const toggleTimestamps = () =>
  {
    setShowTimestamps(!showTimestamps)
  }


//   const handleSend = () => {
//     if (messageIsStreaming) {
//       return;
//     }

//     if (!content) {
//       alert(t('Please enter a message'));
//       return;
//     }

//     // Test implementation
//     const newcontent  = content?.replace(/{{(.*?)}}/g, (match, variable) => {
//       const index = filenames.indexOf(variable);
//       return filecontents[index];
//     });

//     onSend({ role: 'user', content: newcontent}, plugin);
//     setContent('');   // this reset content to empy so any setcontent before this is ignored (executed at the same time)
//     setPlugin(null);

//     if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
//       textareaRef.current.blur();
//     }
//   };



  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };



  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${
        textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
      }`;
    }
  }, [content]);



  function check() {

    let cleaned_message = ''

    if (showTimestamps) {
      for (const segment of selectedConversation?.segments) {
        cleaned_message += "["+segment.startTime + " , " +  segment.endTime + "]" +   segment.text
      }
      
    }
    else
    {

      for (const segment of selectedConversation?.segments) {
        cleaned_message +=segment.text
      }
    }



    return cleaned_message
    
  };



  return (
    <div className="group md:px-4 mr-10">
      

      <div className="flex flex-row">

      <textarea
            id="input_area"
            ref={textareaRef}
            className="m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-10 text-black dark:bg-transparent dark:text-white md:py-3 md:pl-10"
            style={{
              resize: 'none',
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              maxHeight: '400px',
              overflow: `${
                textareaRef.current && textareaRef.current.scrollHeight > 400
                  ? 'auto'
                  : 'hidden'
              }`,
            }}
            placeholder='Upload an audio file or record using microphone to transcribe...'
            value={check()}
            rows={100}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            // onChange={handleChange}
            // onKeyDown={handleKeyDown}
          />

      
      <div className="grid grid-cols-1 place-items-start">
                
        <button
          className="invisible group-hover:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={toggleTimestamps}
        >
          <IconClockHour3 size={20} />
        </button>


        <button
          className="invisible group-hover:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={onEditToggle}
        >
          <IconEdit size={20} />
        </button>


        <button
          className="invisible group-hover:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          // onClick={copyOnClick}
        >
          <IconCopy size={20} />
        </button>

        <button
          className="invisible group-hover:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          // onClick={copyOnClick}
        >
          <IconFaceId size={20} />
        </button>

        <div className='row-span-6'></div>


              
      </div>
        
      

</div>




   
    </div>
  );
};
