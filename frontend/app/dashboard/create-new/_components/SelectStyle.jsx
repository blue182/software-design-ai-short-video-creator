"use client"
import Image from 'next/image'
import React from 'react'
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

function SelectStyle({ onUserSelect }) {
    const [styleOptions, setStyleOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        axios.get('/styles')
            .then((response) => {
                setStyleOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching styles:', error);
            });
    }, []);

    return (
        <div className='mt-10'>
            <h2 className="font-bold text-primary text-lg sm:text-xl md:text-xl lg:text-2xl">Style</h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-500">Select your video style</p>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5'>
                {styleOptions.map((item, index) => (
                    <div key={index}
                        className={`relative hover:scale-105 transition-all duration-300 cursor-pointer rounded-xl
                        ${selectedOption === item.name ? 'border-4 border-blue-500' : ''}`}
                    >
                        <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={100}
                            height={200}
                            className='h-48 object-cover rounded-lg w-full'
                            onClick={() => {
                                setSelectedOption(item.name);
                                onUserSelect('imageStyle', item.name);
                            }}
                        />
                        <p className="absolute p-1 text-center w-full text-white rounded-b-lg bg-black bottom-0 text-sm sm:text-base md:text-base lg:text-lg">
                            {item.name}
                        </p>

                    </div>
                ))}

            </div>

        </div >
    )
}

export default SelectStyle