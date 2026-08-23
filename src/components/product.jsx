"use client"
import React from 'react'
import Link from 'next/link'
const product = () => {
  return (
    <div className=' bg-primary text-foreground p-3 rounded-full h-15 w-15 sm:rounded-full'>
      <Link href="/addProduct" className='flex gap-2 items-center justify-center'><p className="text-4xl">+</p></Link>
    </div>
  )
}

export default product
