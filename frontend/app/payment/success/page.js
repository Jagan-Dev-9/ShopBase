"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { useTheme } from '../../../contexts/ThemeContext';

export default function PaymentSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { isDark } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className={`relative min-h-screen ${
            isDark 
                ? 'bg-gradient-to-tr from-[#191720] via-[#35235e] via-70% to-[#fb7185]'
                : 'bg-gradient-to-tr from-blue-50 via-pink-50 via-70% to-purple-100'
        }`}>
            {/* Background effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className={`absolute left-1/4 top-0 h-80 w-2/5 blur-3xl rounded-full ${
                    isDark ? 'bg-pink-300 opacity-20' : 'bg-pink-400 opacity-30'
                }`} />
                <div className={`absolute right-5 bottom-1/4 h-72 w-1/3 blur-3xl rounded-full ${
                    isDark ? 'bg-indigo-400 opacity-20' : 'bg-blue-400 opacity-30'
                }`} />
            </div>
            
            <Navbar />
            
            <main className="relative z-10 pt-20 pb-8">
                <div className="flex items-center justify-center min-h-[80vh] px-6">
                    <div className={`max-w-md w-full backdrop-blur-lg rounded-3xl p-12 shadow-2xl border text-center ${
                        isDark 
                            ? 'bg-white/10 border-white/20'
                            : 'bg-white/40 border-white/30'
                    }`}>
                        {/* Success Icon */}
                        <div className="text-green-500 mb-6">
                            <svg className="mx-auto h-20 w-20" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        
                        <h1 className={`text-3xl font-bold mb-4 ${
                            isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                            Payment Successful! 🎉
                        </h1>
                        
                        <p className={`mb-6 text-lg ${
                            isDark ? 'text-white/80' : 'text-gray-600'
                        }`}>
                            Thank you for your purchase! Your payment has been processed successfully.
                        </p>
                        
                        {sessionId && (
                            <div className={`mb-6 p-4 rounded-xl backdrop-blur-sm ${
                                isDark 
                                    ? 'bg-white/10 border border-white/20'
                                    : 'bg-white/50 border border-white/30'
                            }`}>
                                <p className={`text-sm ${
                                    isDark ? 'text-white/70' : 'text-gray-500'
                                }`}>
                                    Session ID: <span className="font-mono text-xs break-all">{sessionId}</span>
                                </p>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <Link 
                                href="/products"
                                className="block w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-2xl hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl font-semibold text-lg"
                            >
                                Continue Shopping
                            </Link>
                            
                            <Link 
                                href="/account"
                                className={`block w-full py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm border font-semibold text-lg ${
                                    isDark 
                                        ? 'bg-white/10 border-white/30 text-white/90 hover:bg-white/20'
                                        : 'bg-white/50 border-white/30 text-gray-800 hover:bg-white/70'
                                }`}
                            >
                                View Order History
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
