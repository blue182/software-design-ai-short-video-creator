'use client'

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"


export default function ConfirmDeleteAlert({ videoId, onDeleted, trigger }) {
    const handleDelete = async () => {
        try {
            const res = await fetch('/api/videos/delete-video', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId }),
            })

            const data = await res.json()

            if (res.ok) {
                onDeleted?.()
                toast('✅ Video deleted successfully')

            } else {
                toast('❌ Failed to delete video')
                console.error(data.error)
            }
        } catch (err) {
            console.error(err)
            toast('❌ Unexpected error')
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}

            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader className="flex flex-col items-center text-center space-y-2 mt-4 mb-2">
                    <div className="bg-red-100 p-3 rounded-full mb-3">
                        <AlertTriangle className="text-red-600 w-8 h-8" />
                    </div>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-500 text-center">
                        This action cannot be undone. This will permanently delete your video and remove all its data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogHeader>

                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Yes, delete it</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
