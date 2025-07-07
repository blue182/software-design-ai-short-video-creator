// "use client";

// import {
//     AlertDialog,
//     AlertDialogContent,
//     AlertDialogHeader,
//     AlertDialogFooter,
//     AlertDialogTitle,
//     AlertDialogDescription,
//     AlertDialogCancel,
// } from "@/components/ui/alert-dialog";
// import { AlertTriangle } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function ErrorAlertDialog({ open, onClose, missingFields = [] }) {
//     return (
//         <AlertDialog open={open} onOpenChange={onClose}>
//             <AlertDialogContent>
//                 <AlertDialogHeader className="text-center flex flex-col items-center">

//                     <AlertTriangle className="text-red-500 mt-1" />
//                     <div>
//                         <AlertDialogTitle className="text-red-600 text-lg text-center">
//                             Missing Required Fields
//                         </AlertDialogTitle>
//                         <AlertDialogDescription className="text-sm text-gray-500">
//                             Please fill in the following fields before continue:
//                         </AlertDialogDescription>
//                     </div>
//                 </AlertDialogHeader>

//                 <div className="flex flex-col items-center justify-center">
//                     <div>
//                         <ul className="list-disc ml-6 text-sm text-red-500 mt-2">
//                             {missingFields.map((field, index) => (
//                                 <li key={index}>{field}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>

//                 <AlertDialogFooter className="pt-4">
//                     <AlertDialogCancel asChild>
//                         <Button variant="outline" onClick={onClose}>
//                             Close
//                         </Button>
//                     </AlertDialogCancel>
//                 </AlertDialogFooter>
//             </AlertDialogContent>
//         </AlertDialog>
//     );
// }



"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorAlertDialog({ open, onClose, missingFields = [] }) {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="bg-primary-50 border border-red-200 shadow-lg rounded-xl">
                <AlertDialogHeader className="flex flex-col items-center text-center space-y-2 mt-4 mb-2">
                    <div className="bg-red-100 p-3 rounded-full mb-3">
                        <AlertTriangle className="text-red-600 w-8 h-8" />
                    </div>
                    <AlertDialogTitle className="text-xl font-semibold text-primary-700">
                        Missing Required Fields
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-primary-500">
                        Please complete the following fields before continuing:
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="mt-4 px-4 w-full">
                    <div className="bg-white border border-red-200 rounded-md py-4 px-10 shadow-sm">
                        <ul className="space-y-2">
                            {missingFields.map((field, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-2 text-sm text-red-700 "
                                >
                                    <span className="mt-1 w-2 h-2 bg-red-500 rounded-full shrink-0"></span>
                                    <span className="ms-3 text-sm sm:text-base md:text-base lg:text-lg">{field}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                <AlertDialogFooter className="pt-6 justify-center">
                    <AlertDialogCancel asChild>
                        <Button
                            variant="ghost"
                            className="border border-primary-300 text-primary-600 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
