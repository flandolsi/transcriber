import React from "react";
import { useContext, useState, useCallback, useMemo} from 'react';
import HomeContext from '@/pages/api/home/home.context';

import {IconEdit, IconCopy, IconClockHour3, IconFaceId,IconLock, IconLockOpen, IconUvIndex } from '@tabler/icons-react';


interface Props {
  onSelectSegment: (start: string, end: string) => void;
}


export  const SimpleReactTable =({
  onSelectSegment,

}: Props) => {


const {
    state: { selectedConversation },

    dispatch: homeDispatch,
    } = useContext(HomeContext);

    const [isEditable, setIsEditable] =useState(false)
    const [showTimestamps, setShowTimestamps] =useState(false)
    const [selectedRow, setSelectedRow] = useState(-1);
    const [editValue, setEditValue] = useState('')
  


    const onChange = useCallback((e) => {

      const val = e.target.value;
      setEditValue(val)

    }, []);


    const onBlur = useCallback((e) => {

      const val = e.target.value;
      // console.log(selectedRow)
      // console.log(val)

    }, []);



  const toggleEditMode = () =>
  {
    setIsEditable(!isEditable)
  }


  const toggleTimestamps = () =>
  {
    setShowTimestamps(!showTimestamps)
  }


  



  return (
    <div className="group md:px-4 mr-10">


      <div className="flex flex-row">

      <div className='table_container'>

        <table className="table-fixed w-full" onClick={() => {  }}>
          <thead onClick={(e) => { 
              e.stopPropagation();
                }}>
            <tr>
              <th className="w-20">{showTimestamps && (<p>ID</p>)} </th>
              <th className={(showTimestamps  ? 'w-20' : 'w-0')}>{showTimestamps && (<p>Start [s]</p>)}  </th>
              <th className={(showTimestamps  ? 'w-20' : 'w-0')}>{showTimestamps && (<p>End [s]</p>)}    </th>
              <th className='w-full'>{showTimestamps && (<p>Text</p>)} </th>
            </tr>
          </thead>
          <tbody>
            {selectedConversation?.segments.map((segment, index) => {
              return (
                <tr key={index} onClick={() => {
                      setSelectedRow(segment.id); 
                      setEditValue(segment.text); 
                      onSelectSegment(segment.startTime,segment.endTime)
                      }} className={"clickable-row ".concat(selectedRow === segment.id ? "selected" : "")}>

                  <td className="text-center" >{showTimestamps && (<p>{segment.id}</p>)}</td>  
                  <td> {showTimestamps && (<p>{segment.startTime}</p>)}</td>
                  <td>{showTimestamps && (<p>{segment.endTime}</p>)}</td>
                  <td>
                  {isEditable && ((index+1)===selectedRow) ? (
                    
                    <textarea className="w-full border-0 bg-transparent"
                          placeholder="First Name"
                          value={editValue}
                          onChange={onChange}
                          onBlur={()=>{ 
                            console.log(index);
                            selectedConversation.segments[index].text=editValue;
                          }
                          }  // Update segment.text that was updated
                    />
                  ):(<p>{segment.text}</p>)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>


      <div className="grid grid-cols-1 place-items-start ">

        <div className="h-150">  
                
        <button
          className="invisible group-hover:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={toggleEditMode}
        >
          {isEditable ? (<IconLock size={20} />) : (<IconLockOpen size={20} />) }
        </button>

                        
        <button
          className="invisible group-hover:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={toggleTimestamps}
        >
          <IconClockHour3 size={20} />
        </button>

        </div>

        <div className='row-span-4'></div>


      </div>  
      
                      
      
    </div>

    <div>

      
    </div>

  </div>
  );
}



 // onClick={() => console.log(`Cell ${segment.id}A was clicked!`)}