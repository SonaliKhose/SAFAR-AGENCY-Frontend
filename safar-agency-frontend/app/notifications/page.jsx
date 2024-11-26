"use client"
import { useRouter } from 'next/navigation';
import React from 'react'
import { useEffect } from 'react';

const Notifications = () => {
  const router = useRouter();
  useEffect(() => {
    const loginToken = sessionStorage.getItem("authToken");
    if (!loginToken) {
      router.push("/login"); // Redirect to login page if token is missing
    }
  }, [router]);
  return (
    <div>
      Notifications
    </div>
  )
}

export default Notifications
