'use client';
import React from 'react';

import { useSession } from 'next-auth/react';

import { dispatch, useSelector } from '@/store';
import BaseAvatar from '@/components/user/BaseAvatar';
import Loading from '@/components/layouts/loading';

import { closeUploadProfilePic, openSidePanel } from '@/store/slices/menu';
import { useAuth } from '../AuthProvider';

const ConnectButton = () => {
    const { walletSignIn } = useAuth();
    const { status } = useSession();
    const { authUser, getMeStatus } = useSelector((state: any) => state.auth);

    const handleOpenUserProfile = (e: any) => {
        e.stopPropagation(); 
        dispatch(closeUploadProfilePic());
        dispatch(openSidePanel({ type: 'edit-profile', data: authUser }));
    };

    return (
        <>
            {status === 'authenticated' && authUser ? (
                <div className="hidden sm:flex flex-col-reverse sm:flex-row items-center gap-2">
                    <div className="flex items-center sm:order-last" onClick={(e) => handleOpenUserProfile(e)}>
                        {getMeStatus === 'loading' ? <Loading /> : <BaseAvatar image={authUser?.image} />}
                    </div>
                </div>
            ) : (
                <div className="hidden sm:block">
                    <button type="button" className="h-button h-button-border h-10 min-h-10 px-5 py-2.5 bg-white/10" onClick={walletSignIn}>
                        <div className="text-white text-base font-semibold font-figtree">Sign In</div>
                    </button>
                </div>
            )}
        </>
    );
};

export default ConnectButton;
