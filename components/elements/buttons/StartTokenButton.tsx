'use client';
import React from 'react';
import { useSession } from 'next-auth/react';

import { useAuth } from '@/components/auth/AuthProvider';
import { PAGE_LINKS } from '@/constants/constants';

const StartTokenButton = () => {
    const { status } = useSession();
    const { walletSignIn } = useAuth();

    const handleClick = async () => {
        if (status !== 'authenticated') {
            await walletSignIn();
            return;
        }

        window.location.href = PAGE_LINKS['TOKEN_CREATE'];
    };

    return (
        <button onClick={handleClick} type="button" className="h-button h-button-border h-10 px-5 py-2.5 bg-white/10">
            <div className="base-white text-base font-semibold">Start A New Token 🩵</div>
        </button>
    );
};

export default StartTokenButton;
