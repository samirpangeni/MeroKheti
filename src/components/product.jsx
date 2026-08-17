"use client"
import React from 'react'
import Link from 'next/link'
const product = () => {
  return (
    <div className=' bg-green-600 text-black p-3 rounded-full h-15 w-15 sm:rounded-full'>
      <Link href="/addProduct" className='flex gap-2 items-center justify-center'><p className="text-4xl">+</p> <p className='hidden md:block'>Upload product</p></Link>
    </div>
  )
}

export default product
