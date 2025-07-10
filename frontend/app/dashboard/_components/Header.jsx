import Image from 'next/image'
import React from 'react'

import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

function Header({ onToggleSidebar }) {
  return (
    <div className='p-3 px-5 flex items-center justify-between bg-white shadow-md rounded-lg'>
      <button
        className="md:hidden block text-primary"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className='flex gap-3 items-center'>
        <Image src={'/logo.png'} alt="Logo" width={50} height={50} />
        <h2 className='font-bold text-xl text-primary'>AIzento</h2>
      </div>



      <div className='flex items-center gap-3 mt-2'>
        <Button>
          <a href="/dashboard">Dashboard</a>
        </Button>



        <UserButton />
      </div>
    </div>
  )
}

export default Header