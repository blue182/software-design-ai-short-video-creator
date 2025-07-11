'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { VideoFrameContext } from '@/app/_contexts/VideoFrameContext';


export default function AudioTrimmer({ file, onTrimmed, maxDuration = 5 }) {
  const { videFrames } = useContext(VideoFrameContext);
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [loading, setLoading] = useState(false);

  const url = file ? URL.createObjectURL(file) : null;
  const end = Math.min(start + maxDuration, duration);

  const handleLoadedMetadata = () => {
    const dur = audioRef.current?.duration || 0;
    setDuration(dur);
    setStart(prev => (prev === 0 ? 0 : prev));
  };

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = start;

    const onSeeked = () => {
      audio.removeEventListener("seeked", onSeeked);
      audio.play();

      const end = start + maxDuration;
      const interval = setInterval(() => {
        if (audio.currentTime >= end) {
          audio.pause();
          clearInterval(interval);
        }
      }, 100);
    };
    audio.currentTime = start;


    audio.addEventListener("seeked", onSeeked);
  };


  const handleTrim = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('start', start.toString());
      formData.append('end', end.toString());
      formData.append('duration', duration.toString());
      formData.append('id_cloud', videFrames?.id_cloud);

      const res = await fetch('/api/audio', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Trim failed');

      console.log('✅ Uploaded audio URL:', data.url);
      onTrimmed(data.url);
    } catch (err) {
      console.error('❌ Trim failed:', err);
      alert('Trim failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!file) return;

    const newUrl = URL.createObjectURL(file);
    setStart(0);
    setDuration(0);

    return () => {
      URL.revokeObjectURL(newUrl); // cleanup tránh memory leak
    };
  }, [file]);



  console.log('duration:', duration, 'start:', start, 'end:', end);


  return (
    <div className="space-y-5">
      {url && (
        <div className='w-full flex justify-center py-3'>
          <audio
            ref={audioRef}
            src={url}
            controls
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full"
          />
        </div>
      )}

      <>
        <label className="text-sm text-gray-700 block mb-2">
          ⏱ Start Time: {start.toFixed(2)}s → End: {end.toFixed(2)}s
        </label>
        <div className="mb-10">
          <Slider
            min={0}
            max={Math.max(0, duration - maxDuration)}
            step={0.1}
            value={[start]}
            onValueChange={(val) => {
              if (Array.isArray(val)) setStart(val[0]);
            }}
            className="w-full"
          />
        </div>
      </>


      <div className="flex gap-2 justify-between items-center mt-10 pt-10">
        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ▶️ Play
        </button>

        <button
          onClick={handleTrim}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? '⏳ Trimming...' : '✂️ Trim & Upload'}
        </button>
      </div>

    </div>
  );
}
