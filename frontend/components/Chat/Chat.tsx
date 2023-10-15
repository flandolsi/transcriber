import Image from 'next/image'
import axios, { AxiosRequestConfig } from "axios";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ChatInput } from './ChatInput';
import { BACKEND_API_HOST } from '@/utils/app/const';

import {
  MutableRefObject,
  memo,
  useContext,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import {
  saveConversation,
  saveConversations,
  updateConversation,
} from '@/utils/app/conversation';

import { Segment, Conversation } from '@/types/chat';
import HomeContext from '@/pages/api/home/home.context';




interface Props {
  stopConversationRef: MutableRefObject<boolean>;
}

export const Chat = memo(({ stopConversationRef }: Props) => {

  const {
    state: {
      selectedConversation,
      conversations,
      apiKey,
      messageIsStreaming,
      loading,
    },
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext);


  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showScrollDownButton, setShowScrollDownButton] = useState<boolean>(false);


  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [percentage, setPercentage] = useState(0)
  const [messageContent, setMessageContent] = useState()
  const [fileIsUploading, setFileIsUploading] = useState(false)




  const onUploadFile = async (file) => {

    if (!file) {
      return;
    }

    if (BACKEND_API_HOST == '') {
      alert('Please set backend host in .env.local')
      return;
    }

    setFileIsUploading(true)

    try 
    {
      const response = await axios({
        method: 'post',
        headers: { 
                  'Content-Type': 'audio/mpeg', //'video/mp4', // 'audio/mpeg' ,  "multipart/form-data",
                  'Access-Control-Allow-Origin' : '*',
                  'Access-Control-Allow-Headers' : '*',
                },
        url: BACKEND_API_HOST, //API url
        data: file,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: progressEvent => {        
          setPercentage(Math.round(progressEvent.loaded / file.size *100))
        },
        onDownloadProgress: progressEvent => {

          var tempText = progressEvent.event.currentTarget.response

          // JSON Parse
          
          let theText =''
          let segments : Segment[] =[]; 
          

          var data = JSON.parse('['+tempText.replace(/}{/g, "},{")+']')

          for (let i = 0; i < data.length; i++) {
            theText += data[i]['text']

            let segment : Segment = {startTime:'', endTime:'',text:''};

            segment.startTime = data[i]['start']
            segment.endTime   = data[i]['end']
            segment.text      = data[i]['text']

            segments.push(segment)

          }

          // Test implementation  
          let updatedConversation: Conversation;
          updatedConversation = selectedConversation
          updatedConversation.messages = theText
          updatedConversation.segments = segments

          


          updatedConversation.segments.push()



          homeDispatch({
            field: 'selectedConversation',
            value: updatedConversation,
          });

        },
  
      });

    } 
    catch (error) 
    {
      console.log(error);
    }

    console.log(selectedConversation)

    setPercentage(0)
    setFileIsUploading(false)
  
  }

  const handleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">


<input
    id="import-audio"
    className="sr-only"
    tabIndex={-1}
    type="file"
    accept=".mp3"
    onChange={(e) => {
      if (!e.target.files?.length) return;

      const file = e.target.files[0];
      const reader = new FileReader();


      reader.addEventListener(
        "load",
        () => {
          console.log(file.name)
        },
        false,
      );
    
      if (file) {

        console.log(file)
        onUploadFile(file)
      }

    }}
    />





  <div>
      {fileIsUploading ? (
              <div className='flex w-10 absolute top-5 right-10'>
              <CircularProgressbar value={percentage} text={'Upload'} />    
              {/*  use to display {`${percentage}%`} */}
              </div>
        ):(

          <a className=" flex w-20 absolute top-5 right-3">
            By{' '}
            <Image
              src="/logo.svg"
              alt="logo"
              className="dark:invert border"
              width={25}
              height={25}
              priority
            />
          </a>
        )}
  </div>

  <div>
    {selectedConversation.messages.length == 0 ? (


      <div className="flex items-center justify-center h-screen">

        <div className="group w-1/4 justify-self-center rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        onClick={() => {
          const importFile = document.querySelector('#import-audio',) as HTMLInputElement;
          if (importFile) {
            importFile.click();
          }
        }}
        > 
          
        <h2 className={`mb-3 text-2xl font-semibold`}>
            Upload File{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            transcribe / translate audio files.
          </p>

          </div>

      </div>


      ):(

        <div className="w-full py-20">

        <label>File properties</label>

        <ChatInput
            stopConversationRef={stopConversationRef}
            textareaRef={textareaRef}
            // onSend={(message, plugin) => {
            //   setCurrentMessage(message);
            //   handleSend(message, 0, plugin);
            // }}
            // onScrollDownClick={handleScrollDown}
            // onRegenerate={() => {
            //   if (currentMessage) {
            //     handleSend(currentMessage, 2, null);
            //   }
            // }}
            // showScrollDownButton={showScrollDownButton}
          />

          </div>


      )}



    
</div> 

   




    </div>
  );
});
Chat.displayName = 'Chat';
