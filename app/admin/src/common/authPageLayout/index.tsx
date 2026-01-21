import { ASSETS } from '@/helpers/assets';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userProvider';

interface AuthPageLayoutProps {
    children: React.ReactNode;
}


const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if already logged in
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    // Don't render auth pages if user is already authenticated
    if (user) {
        return null;
    }

    return (
        <div className='h-[100svh] w-full flex'>
            {/* Left Side: Logo and Tagline */}
            <div className='flex-1 hidden lg:flex items-center justify-center bg-gradient-to-br from-primary to-blue-900 text-white relative overflow-hidden'>
                <div className="absolute inset-0 opacity-20 z-0">
                    <svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" stroke="currentColor" strokeWidth="100">
                            <circle r="234" cx="196" cy="23" />
                            <circle r="234" cx="790" cy="491" />
                        </g>
                    </svg>
                </div>
                <div className='z-10 flex flex-col items-center justify-center w-full h-full'>
                    <img
                        src={ASSETS.logo}
                        alt='logo'
                        width={120}
                        height={120}
                        onClick={() => navigate("/")}
                        className='cursor-pointer mb-8'
                        style={{ objectFit: "contain", backgroundColor: "transparent" }}
                    />
                    <h1 className='text-3xl font-bold mb-2 drop-shadow-lg text-center'>Welcome to the Park Nest Admin Panel</h1>
                </div>
            </div>
            {/* Right Side: Auth Content */}
            <div className='flex-[1.4] flex items-center justify-center bg-white min-h-[100svh] py-10 px-4 lg:px-16 shadow-lg relative z-10'>
                <div className="w-full max-w-[400px] flex flex-col gap-2 justify-center">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthPageLayout