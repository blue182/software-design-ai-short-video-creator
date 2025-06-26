import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {/* Background image */}
            <Image
                src="/bg-auth.jpg" // Replace with your actual background image
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="z-0"
            />

            {/* Blur + dark overlay */}
            <div className="absolute inset-0 bg-black/2 backdrop-blur-sm z-10" />

            {/* Main content */}
            <div className="relative z-20 flex h-full w-full">
                {/* Left side - Logo, title, tagline */}
                <div className="w-1/2 flex flex-col items-center justify-center px-10 text-white text-center">
                    <div className="mb-6 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-[0.5px] ring-white/40 shadow-xl">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={250}
                            height={250}
                        />
                    </div>

                    <h1 className="text-5xl font-bold mb-4">AI Short Video Creator</h1>
                    <p className="text-xl max-w-md">
                        Create stunning, AI-powered short videos in seconds. Fast. Creative. Effortless.
                    </p>
                </div>

                {/* Right side - Sign in form */}
                <div className="w-1/2 flex items-center justify-center">
                    <div className="bg-white/20 p-8 rounded-xl shadow-lg backdrop-blur-md">
                        <SignIn
                            appearance={{
                                elements: {
                                    formButtonPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
                                    formFieldInput:
                                        'border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black',
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
