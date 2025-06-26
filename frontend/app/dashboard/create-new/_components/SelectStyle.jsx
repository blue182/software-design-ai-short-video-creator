"use client"
import Image from 'next/image'
import React from 'react'

function SelectStyle({ onUserSelect }) {
    const styleOptions = [
        {
            name: 'Animated',
            image: '/style.jpg'
        },
        {
            name: 'Documentary',
            image: '/style.jpg'
        },
        {
            name: 'Live Action',
            image: '/style.jpg'
        },
        {
            name: 'Whiteboard Animation',
            image: '/style.jpg'
        },
        {
            name: 'Stop Motion',
            image: '/style.jpg'
        },
        {
            name: 'Motion Graphics',
            image: '/style.jpg'
        }
    ]

    const [selectedOption, setSelectedOption] = React.useState('');

    return (
        <div className='mt-10'>
            <h2 className='font-bold text-xl'>Style</h2>

            <p className='text-gray-500'>Select your video style</p>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5'>
                {styleOptions.map((item, index) => (
                    <div key={index} className={`relative hover:scale-105 transition-all duration-300 cursor-pointer rounded-xl
                    ${selectedOption === item.name ? 'border-4 border-blue-500' : ''}
                    
                    `}>
                        <Image src={item.image} alt={item.name} width={100} height={200} className='h-48 object-cover rounded-lg w-full'
                            onClick={() => {
                                setSelectedOption(item.name)
                                onUserSelect('imageStyle', item.name)
                            }}

                        />
                        <p className='absolute p-1 text-center w-full text-white rounded-b-lg bg-black bottom-0'>{item.name}</p>
                    </div>
                ))}

            </div>

        </div >
    )
}

export default SelectStyle