"use client"

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const AuthGuard = () => {
    const router = useRouter();
    const [isLoading,setIsLoading] = useState<boolean>(true);
    
  return (
    <div>AuthGuard</div>
  )
}

export default AuthGuard