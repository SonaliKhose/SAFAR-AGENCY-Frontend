"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState('Verifying your email...');
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      //console.log(token);

      if (token) {
        try {
          const response = await fetch(`http://localhost:5000/users/verify?token=${token}`);
         // console.log(response);

          if (response.ok) {
            // Update state with the success message
            setVerificationStatus('Email verified successfully!');
            
            // Redirect to login page after a delay of 2 seconds
            setTimeout(() => {
              router.push('/login');
            }, 3000);
          } 
        } catch (error) {
          setVerificationStatus('An error occurred during verification.');
        }
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2 style={{ color: verificationStatus.includes('successfully') ? 'green' : 'red' }}>
        {verificationStatus}
      </h2>
    </div>
  );
}
