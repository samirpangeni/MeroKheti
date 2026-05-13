"use client"
import React from 'react'
import Link from 'next/link'
const product = () => {
  return (
    <div className=' bg-white text-black p-3 rounded-2xl h-fit w-fit '>
      <Link href="/addProduct" className='flex gap-2'><p>+</p> <p>Upload product</p></Link>
    </div>
  )
}

export default product
