import React, { useRef, useState, useEffect } from "react";
import {IconPlayerStop, IconPlayerPlay, IconPlayerPause, IconPlayerSkipForward,IconPlayerSkipBack, IconLockOpen, IconUvIndex } from '@tabler/icons-react';


interface Props {
  srcRef: string;
  seekSeconds: string;
}


export  const AudioPlayer=({

  srcRef,
  seekSeconds

}: Props) => {

  const audioPlayer = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [seekValue, setSeekValue] = useState(0);


  const play = () => {
    audioPlayer.current.play();
  };

  const pause = () => {
    audioPlayer.current.pause();
  };

  const stop = () => {
    audioPlayer.current.pause();
    audioPlayer.current.currentTime = 0;
  };

  const setSpeed = (speed) => {
    audioPlayer.current.playbackRate = speed;
  };

  const onPlaying = () => {
    setCurrentTime(audioPlayer.current.currentTime);
    setSeekValue(
      (audioPlayer.current.currentTime / audioPlayer.current.duration) * 100
    );
  };


  useEffect(()=>{
    pause()
    console.log(seekSeconds)
    audioPlayer.current.currentTime = seekSeconds;
    play()
  },[seekSeconds])


  return (
    <div className="group md:px-4 mr-10">
      <audio
        src={srcRef}
        ref={audioPlayer}
        onTimeUpdate={onPlaying}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      
      <br />

      <div className="grid grid-cols-7 place-items-center ">


        <button onClick={() => setSpeed(1.5)}><IconPlayerSkipBack size={20} /></button>
        <button onClick={() => setSpeed(2)}><IconPlayerSkipBack size={20} /></button>
        <button onClick={play}><IconPlayerPlay size={50} /></button>
        <button onClick={pause}><IconPlayerPause size={50} /></button>
        <button onClick={stop}><IconPlayerStop size={20} /></button>
        <button onClick={() => setSpeed(0.5)}><IconPlayerSkipForward size={20} /></button>
        <button onClick={() => setSpeed(1)}><IconPlayerSkipForward size={20} /></button>

        <input className="col-span-7 w-full mt-6 mb-6"
        type="range"
        min="0"
        max="100"
        step="1"
        value={seekValue}
        onChange={(e) => {
          const seekto = audioPlayer.current.duration * (+e.target.value / 100);
          audioPlayer.current.currentTime = seekto;
          setSeekValue(e.target.value);
        }}
      />

      </div>


      


      <p>{currentTime}</p>

    </div>
  );
}