import Image from 'next/image'
import React from 'react'

import { UserButton } from '@clerk/nextjs';

function Header() {
  return (
    <div className='p-3 px-5 flex items-center justify-between bg-white shadow-md rounded-lg'>
      <div className='flex gap-3 items-center'>
        <Image src={'/logo.png'} alt="Logo" width={50} height={50} />
        <h2 className='font-bold text-xl text-primary'>AIzento</h2>
      </div>
      <div className='flex items-center gap-3 mt-2'>
        <button className='bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors'>
          <a href="/dashboard">Dashboard</a>
        </button>

        <UserButton />
      </div>
    </div>
  )
}

export default Header