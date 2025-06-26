import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Home() {
  const user = await currentUser();
  if (user) {
    redirect('/dashboard');
  }
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/bg-video.mp4" type="video/mp4" />

      </video>



      {/* Overlay mờ nhẹ */}
      {/* <div className="absolute inset-0 bg-black/0.5 backdrop-blur-sm z-10" /> */}

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between p-4 px-6 sm:px-8 bg-white/5 backdrop-blur-sm shadow-md">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={60} height={60} />
            <h2 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-white">
              AI Short Video Creator
            </h2>
          </div>
          <Link href="/sign-in">
            <Button
              variant="ghost"
              className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white
                  bg-gradient-to-br from-zinc-800 to-white/30 border border-white/20
                  shadow-md rounded-gl px-4 sm:px-6 md:px-7 md:py-6 sm:py-4 
                  hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-900 
                  hover:shadow-xl hover:scale-105 hover:text-white 
                  transition-all duration-300"
            >
              Sign In
            </Button>
          </Link>
        </header>


        {/* Main Centered Section */}
        <main className="flex flex-1 items-center justify-center text-white text-center px-4">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">
                Welcome to
              </h1>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold 
                 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-white mb-2">
                AIzento
              </h1>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white/90 mt-2">
                AI Short Video Creator
              </h2>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto mt-4 mb-8">
                Your Ideas. Our AI. Viral Short Videos.
              </p>
            </div>


            {/* Nút Start Now */}
            <div className="mt-6">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="group bg-gradient-to-br from-neutral-800 via-white-100 to-blue-700 text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold 
               border-[1.5px] border-white/40 shadow-md rounded-xl px-8 py-8 
               hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-900 
               hover:shadow-xl hover:scale-105 hover:text-white 
               transition-all duration-300 flex items-center gap-3"
                >
                  Start Now
                  <ArrowRight
                    className="transition-transform duration-300 group-hover:translate-x-4"
                    style={{ width: '32px', height: '32px' }}
                  />
                </Button>
              </Link>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
