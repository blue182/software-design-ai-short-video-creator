import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription
} from "@/components/ui/alert-dialog"
import Image from 'next/image'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

function ProcessingVideo({ loading }) {
    return (
        <div>
            <AlertDialog open={loading}>

                <AlertDialogContent className="bg-white">
                    <VisuallyHidden>
                        <AlertDialogTitle>Loading dialog</AlertDialogTitle>
                    </VisuallyHidden>
                    <VisuallyHidden>
                        <AlertDialogDescription>
                            The script is being generated. Please wait.
                        </AlertDialogDescription>
                    </VisuallyHidden>
                    <div>
                        <Image src={'/load-time.gif'} alt="Loading" width={100} height={100} className="mx-auto mb-4" />
                        <h2 className="text-lg font-bold text-center mb-2">Processing video...</h2>
                        <p className="text-center text-gray-500">Please wait a moment.</p>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ProcessingVideo;