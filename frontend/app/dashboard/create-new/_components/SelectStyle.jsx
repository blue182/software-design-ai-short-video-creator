"use client"
import Image from 'next/image'
import React from 'react'
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import LoadingData from '@/components/LoadingData';

function SelectStyle({ onUserSelect, selected, hasError }) {
    const [styleOptions, setStyleOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/styles')
            .then((response) => {
                setStyleOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching styles:', error);
            });
        if (selected) {
            setSelectedOption(selected.style || '');

        }
        setLoading(false);
    }, []);

    return (
        <div >
            <h2 className="font-bold text-primary text-base sm:text-base md:text-lg lg:text-xl">Style</h2>

            <p className="text-sm sm:text-sm md:text-base text-gray-500 mb-2">Select your video style</p>


            {loading ? (
                <LoadingData />
            ) : (
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5 
                ${hasError ? 'border border-red-500 p-2 rounded-lg' : ''}`}>
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
                                    onUserSelect('style', { style: item.name, id: item.id });
                                }}
                            />
                            <p className="absolute p-1 text-center w-full text-white rounded-b-lg bg-black bottom-0 text-sm sm:text-sm md:text-base lg:text-md">
                                {item.name}
                            </p>

                        </div>
                    ))}

                </div>
            )}


            {hasError && (
                <p className="text-red-500 text-sm mt-2">Please select a style.</p>
            )}

        </div >
    )
}

export default SelectStyle