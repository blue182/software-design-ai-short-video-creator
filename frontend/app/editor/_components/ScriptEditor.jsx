'use client';

import { useContext, useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
    AccordionItem, AccordionTrigger, AccordionContent
} from "@/components/ui/accordion";
import { Upload, AudioLines, ImageIcon } from "lucide-react";
import { toast } from 'sonner';
import { VideoFrameContext } from '@/app/_contexts/VideoFrameContext';
import { uploadMediaToCloudinary } from '@/lib/uploadMedia';
import dynamic from 'next/dynamic';
import axios from 'axios';

const AudioTrimmer = dynamic(() => import('@/components/AudioTrimmer'), { ssr: false });

function ScriptEditor({
    frame,
    handleInputChange,
    listImageUserUpload,
    listAudioUserUpload,
    setListImageUserUpload,
    setListAudioUserUpload,
    listAudioTextChange, setListAudioTextChange
}) {
    const [showAIConfirm, setShowAIConfirm] = useState(false);
    const [newAudioText, setNewAudioText] = useState(frame?.audio_text || '');
    const [showTrimDialog, setShowTrimDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const { videoFrames } = useContext(VideoFrameContext);

    useEffect(() => {
        setNewAudioText(frame?.audio_text || '');
    }, [frame]);




    const confirmGenerateAI = async () => {
        setShowAIConfirm(false);
        const toastId = toast.loading('🎙️Creating new audio with AI...');

        try {
            const formData = new FormData();
            formData.append('id_cloud', videoFrames.id_cloud);
            formData.append('audio_text', newAudioText);
            formData.append('oldUrl', listAudioUserUpload[frame?.segment_index]?.url || '');
            formData.append('index', frame?.segment_index || 0);
            formData.append('voice', videoFrames?.infoVideo?.voice?.code);

            formData.append('duration', frame?.duration || 'short');

            console.log("Form data prepared for AI audio generation:", formData);

            const newUrl = await axios.post('/api/audio/generate-audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("AI audio generation response:", newUrl.data);
            console.log("New audio URL from AI:", newUrl.data.url);
            // Cập nhật audio URL mới vào danh sách
            setListAudioUserUpload((prev) => ({
                ...prev,
                [frame?.segment_index]: { url: newUrl.data.url },
            }));
            setListAudioTextChange((prev) => ({
                ...prev,
                [frame?.segment_index]: newAudioText,
            }));
            toast.success('✅ New audio created successfully!', { id: toastId });


        }
        catch (error) {
            console.error('❌ Error creating audio with AI:', error);
            toast.error('❌ Failed to create new audio with AI', { id: toastId });
        }
    };

    // console.log("List audio user upload:", listAudioUserUpload);
    // console.log("List image user upload:", listImageUserUpload);
    // console.log("listAudioTextChange:", listAudioTextChange);

    const handleAudioUpload = async (file) => {

        if (!file) return;
        const old_url = listAudioUserUpload[frame?.segment_index]?.url;
        const toastId = toast.loading('🎙️ uploading audio...');

        try {
            const { url } = await uploadMediaToCloudinary({
                file,
                idCloud: videoFrames.id_cloud,
                type: 'audio',
                oldUrl: old_url || '',
            });
            console.log("Uploaded audio URL:", url);

            // cập nhật local preview
            setListImageUserUpload((prev) => ({
                ...prev,
                [frame?.segment_index]: { url: url },
            }));

            toast.success('✅ Upload audio success!', { id: toastId });
        } catch (err) {
            console.error('❌ Upload failed:', err);
            toast.error('❌ Upload audio failed', { id: toastId });
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const old_url = listImageUserUpload[frame?.segment_index]?.url;
        const toastId = toast.loading('🖼️ uploading image...');

        try {
            const { url } = await uploadMediaToCloudinary({
                file,
                idCloud: videoFrames.id_cloud,
                type: 'image',
                oldUrl: old_url || '',
            });

            setListImageUserUpload((prev) => ({
                ...prev,
                [frame?.segment_index]: { url },
            }));

            toast.success('✅ Upload image success!', { id: toastId });
        } catch (err) {
            toast.error('❌ Upload image failed', { id: toastId });
        }
    };

    const imagePreview = listImageUserUpload[frame?.segment_index]?.url || frame?.image_url;
    const audioPreview = listAudioUserUpload[frame?.segment_index]?.url || frame?.audio_url;

    return (
        <>
            <AccordionItem value="script-editor">
                <AccordionTrigger>
                    <span className='flex items-center gap-2 font-semibold text-base'>
                        <AudioLines className='w-4 h-4 text-green-600' /> Script & Media
                    </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-5">
                    <div className='flex justify-between items-center'>
                        <label className='font-medium '>Duration </label>
                        <span className='font-bold'>{frame?.duration}s</span>
                    </div>

                    <div>
                        <label className='font-medium mb-3 '>Audio Text (use AI to create voice)</label>
                        <div className='flex flex-col justify-center items-center pt-3'>
                            <Textarea
                                value={newAudioText}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setNewAudioText(value);
                                }}
                                className='bg-white resize-y'
                                rows={3}
                            />

                            <Button
                                onClick={() => {
                                    setShowAIConfirm(true);
                                }}
                                className='mt-3'
                            >
                                🎤 Create voice AI
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className='font-medium mb-3 block'>Audio File</label>
                        <div className="flex flex-col items-center gap-3">
                            {audioPreview && (
                                <div className='border border-primary-300 rounded-xl bg-white p-2'>
                                    <audio controls src={audioPreview} className="max-w-xs" />
                                </div>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => setShowTrimDialog(true)}
                                className="flex gap-2 items-center text-sm px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-800 
                                    hover:bg-green-100 hover:font-bold hover:border-gray-400 hover:shadow-sm"
                            >
                                <Upload className="w-4 h-4 text-green-600" />
                                Upload & Trim Audio
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="font-medium mb-3 block">Image</label>
                        <div className="flex flex-col justify-center items-center gap-3">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full max-w-xs sm:max-w-[200px] max-h-60 object-contain rounded border"
                                />
                            )}
                            <label className="inline-flex items-center gap-2 cursor-pointer text-sm px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-800 
                                transition hover:bg-green-100 hover:font-bold hover:border-gray-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                                <ImageIcon className="w-4 h-4 text-green-600" />
                                <span>Upload Your Image</span>
                                <Input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <Dialog open={showAIConfirm} onOpenChange={setShowAIConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Do you want to recreate audio with AI?</DialogTitle>
                    </DialogHeader>
                    <p>The audio text has been changed. Do you want the AI to recreate the new audio?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAIConfirm(false)}>No</Button>
                        <Button onClick={confirmGenerateAI}>Recreate with AI</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showTrimDialog} onOpenChange={(open) => {
                setShowTrimDialog(open);
                if (!open) setSelectedFile(null);
            }}>
                <DialogContent className="max-w-3xl p-10">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">Upload and Trim Audio</DialogTitle>
                        <p className="text-sm text-gray-500 text-center">
                            Because the audio you just uploaded is out of time, please select the audio clip you want to insert at the correct time.
                        </p>
                    </DialogHeader>

                    {!selectedFile ? (
                        <Input type="file" accept="audio/*" onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setSelectedFile(file);
                        }} />
                    ) : (
                        <AudioTrimmer
                            file={selectedFile}
                            onTrimmed={async (blob) => {
                                const trimmedFile = new File([blob], 'trimmed.mp3', { type: 'audio/mpeg' });
                                await handleAudioUpload(trimmedFile);
                            }}
                            maxDuration={frame?.duration || 5}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ScriptEditor;
