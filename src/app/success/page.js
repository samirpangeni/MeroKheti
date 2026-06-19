"use client";
import React from 'react'
import { Suspense } from 'react';
import Success from "@/components/Success"

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Success />
      </Suspense>
    </div>
  )
}
export default Page
