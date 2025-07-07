'use client'
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,

} from "@/components/ui/accordion"
import { LetterText, Sparkles, MessageCircleMore } from 'lucide-react'
import TextAreaBox from './TextAreaBox'
import { VideoFrameContext } from '@/app/_contexts/VideoFrameContext';
import SliderField from './SliderField'
import { Switch } from '@/components/ui/switch'
import ColorPickerField from './ColorPickerField'
import ToggleGroupField from './ToggleGroupField'
import SelectAnimationField from './SelectAnimationField'

function FrameConfig() {
    const { videoFrames, setVideoFrames } = React.useContext(VideoFrameContext);
    const [frame, setFrame] = React.useState([]);


    React.useEffect(() => {
        const newFrame = videoFrames?.framesList?.[videoFrames.selectedFrame];
        if (newFrame && JSON.stringify(frame) !== JSON.stringify(newFrame)) {
            setFrame(newFrame);
        }
    }, [videoFrames.framesList, videoFrames.selectedFrame]);

    const handleInputChange = (field, value) => {
        setFrame(prevFrame => ({
            ...prevFrame,
            [field]: value
        }
        ));
    }

    React.useEffect(() => {
        if (videoFrames?.selectedFrame != null && frame) {
            const framesList = videoFrames?.framesList;
            framesList[videoFrames?.selectedFrame] = frame;
            setVideoFrames(prev => ({
                ...prev,
                framesList: framesList
            })
            );
        }
    }, [frame]);

    const natureHeight = videoFrames?.param?.nature_h;
    const natureWidth = videoFrames?.param?.nature_w;
    const containerAspect = videoFrames?.param?.aspect_ratio;

    const mediaRatio = natureWidth / natureHeight;
    const displayedHeight = containerAspect < mediaRatio
        ? (containerAspect * natureHeight) / mediaRatio
        : natureHeight;





    return (
        <div className='p-3 bg-primary-50 rounded-lg'>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <span className='flex items-center gap-4 text-base font-semibold'>
                            <LetterText style={{ color: 'green' }} /> Text

                        </span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <TextAreaBox frame={frame} handleInputChange={(value) => handleInputChange('text', value)} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <span className='flex items-center gap-4 text-base font-semibold'>
                            <MessageCircleMore style={{ color: 'orange' }} /> Subtitle

                        </span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex items-center space-x-2 mt-3 justify-between">
                            <label className='text-sm'>Add subtitle</label>
                            <Switch
                                id="subtitle-toggle"
                                checked={frame?.subtitle_enabled || false}
                                onCheckedChange={(checked) =>
                                    handleInputChange('subtitle_enabled', checked)
                                }
                            />
                        </div>

                        {frame?.subtitle_enabled && (
                            <div className="mt-4 space-y-4">
                                <SliderField
                                    label="Font Size"
                                    defaultValue={frame?.font_size || 20}
                                    handleInputChange={(value) =>
                                        handleInputChange('font_size', value)
                                    }
                                />

                                <ColorPickerField label='Text Color' defaultValue={frame?.subtitle_color} handleInputChange={(value) => handleInputChange('subtitle_color', value)} />
                                <ColorPickerField label='Background Color' defaultValue={frame?.subtitle_bg} handleInputChange={(value) => handleInputChange('subtitle_bg', value)} />


                                <ColorPickerField label='Stroke Color' defaultValue={frame?.stroke_color} handleInputChange={(value) => handleInputChange('stroke_color', value)} />

                                <SliderField
                                    label="Stroke Width"
                                    defaultValue={frame?.stroke_width || 20}
                                    handleInputChange={(value) =>
                                        handleInputChange('stroke_width', value)
                                    }
                                    maxValue={20}
                                    step={0.5}
                                />

                                <SliderField
                                    label="Space Bottom"
                                    defaultValue={frame?.space_bottom || 20}
                                    handleInputChange={(value) =>
                                        handleInputChange('space_bottom', value)
                                    }
                                    maxValue={displayedHeight}
                                    step={5}
                                />

                                <ToggleGroupField
                                    defaultValue={frame?.text_styles || []}
                                    handleInputChange={(value) => handleInputChange('text_styles', value)}
                                />



                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <span className='flex items-center gap-4 text-base font-semibold'>
                            <Sparkles style={{ color: 'blue' }} /> Animations

                        </span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <SelectAnimationField
                            label="Animation"
                            defaultValue={frame?.animation || 'none'}
                            handleInputChange={(value) =>
                                handleInputChange('animation', value)
                            }

                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default FrameConfig