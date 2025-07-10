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

function ScriptEditor({
    frame,
    handleInputChange,
    listImageUserUpload,
    listAudioUserUpload,
    setListImageUserUpload,
    setListAudioUserUpload
}) {
    const [showAIConfirm, setShowAIConfirm] = useState(false);
    const [newAudioText, setNewAudioText] = useState(frame?.audio_text || '');

    const { videoFrames } = useContext(VideoFrameContext);

    useEffect(() => {
        setNewAudioText(frame?.audio_text || '');
    }, [frame]);

    const handleAudioTextChange = (value) => {
        setNewAudioText(value);
        if (value !== frame.audio_text) {
            setShowAIConfirm(true);
        }
    };

    const confirmGenerateAI = () => {
        setShowAIConfirm(false);
        toast('🎙️ Đang tạo audio mới bằng AI...');
        handleInputChange('audio_text', newAudioText);
        handleInputChange('audio_url', 'new-audio-from-ai.mp3'); // sẽ thay sau bằng URL thật
    };

    const handleAudioUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setListAudioUserUpload((prev) => ({
                ...prev,
                [frame?.segment_index]: file
            }));
            toast.success("🔊 Đã chọn audio mới");
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
            console.log("Uploaded image URL:", url);

            // cập nhật local preview
            setListImageUserUpload((prev) => ({
                ...prev,
                [frame?.segment_index]: { url: url },
            }));

            toast.success('✅ Upload image success!', { id: toastId });
        } catch (err) {
            console.error('❌ Upload failed:', err);
            toast.error('❌ Upload image failed', { id: toastId });
        }
    };
    const imagePreview = listImageUserUpload[frame?.segment_index]
        ? (listImageUserUpload[frame?.segment_index].url)
        : frame?.image_url;

    const audioPreview = listAudioUserUpload[frame?.segment_index]
        ? URL.createObjectURL(listAudioUserUpload[frame?.segment_index])
        : frame?.audio_url;


    return (
        <>
            <AccordionItem value="script-editor">
                <AccordionTrigger>
                    <span className='flex items-center gap-2 font-semibold text-base'>
                        <AudioLines className='w-4 h-4 text-green-600' /> Script & Media
                    </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-5">

                    {/* Audio Text */}
                    <div>
                        <label className='font-medium mb-1 block'>Audio Text (use AI to create voice)</label>
                        <Textarea
                            value={newAudioText}
                            onChange={(e) => handleAudioTextChange(e.target.value)}
                            className='bg-white resize-y'
                            rows={5}
                        />
                    </div>

                    {/* Audio Upload */}
                    <div>
                        <label className='font-medium mb-1 block'>Audio File</label>
                        <div className="flex items-center gap-3">
                            {audioPreview && (
                                <audio controls src={audioPreview} className="max-w-xs" />
                            )}
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <Upload className='w-4 h-4' />
                                <span>Upload Audio</span>
                                <Input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
                            </label>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="font-medium mb-1 block">Image</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full max-w-xs sm:max-w-[200px] max-h-60 object-contain rounded border"
                                />
                            )}
                            <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:underline">
                                <ImageIcon className="w-4 h-4" />
                                <span>Upload Image</span>
                                <Input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>

                </AccordionContent>
            </AccordionItem>

            {/* Confirm AI Dialog */}
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
        </>
    );
}

export default ScriptEditor;
